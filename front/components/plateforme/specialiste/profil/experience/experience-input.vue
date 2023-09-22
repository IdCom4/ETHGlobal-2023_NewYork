<template>
  <section class="modalExperience">
    <!-- BASE DATA -->
    <vmc-input
      v-model="experienceToUpdate.enterprise"
      type="text"
      modal-style
      label="Entreprise"
      :error="formValidator.getErrorsOf('enterprise')[0]"
      @input="formValidator.validateOne('enterprise')"
    />
    <vmc-input
      v-model="experienceToUpdate.role"
      type="text"
      modal-style
      label="Rôle"
      :error="formValidator.getErrorsOf('role')[0]"
      @input="formValidator.validateOne('role')"
    />

    <!-- IS CURRENT STUDY -->
    <div class="modalExperience__currentExperience">
      <p class="modalExperience__currentExperience--text">J'occupe actuellement ce poste</p>
      <vmc-input v-model="isOngoingExperience" type="toggle" modal-style label="Description" />
    </div>

    <!-- DATE RANGE -->
    <div class="modalExperience__date">
      <vmc-input
        v-model="formatedDateRange.begin"
        type="date"
        modal-style
        label="Date de début"
        :error="formValidator.getErrorsOf('begin')[0]"
        @input="formValidator.validateOne('begin')"
      />
      <vmc-input
        v-if="!isOngoingExperience"
        v-model="formatedDateRange.end"
        type="date"
        modal-style
        label="Date de fin"
        :error="formValidator.getErrorsOf('end')[0]"
        @input="formValidator.validateOne('end')"
      />
    </div>

    <!-- ACTION BUTTONS -->
    <div class="modalExperience__buttons">
      <button v-if="!isCreatingNewExperience" class="customButton btn_denied" @click="deleteExperience">Supprimer</button>
      <button v-else class="customButton btn_denied" @click="cancel">Annuler</button>
      <button class="customButton btn_call-to-action" @click="saveExperience">Enregistrer</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IProfessionalExperienceRequest } from '@/composables/resources/api-endpoints/professionals.endpoint'
import { FormValidator } from '@/composables/useValidator'

const emit = defineEmits(['added', 'updated', 'deleted', 'cancel'])
const props = defineProps({ experience: { type: Object as PropType<IProfessionalExperience | null>, default: null } })

const isOngoingExperience = ref<boolean>(!!props.experience && !props.experience.dateRange.end)
const isCreatingNewExperience = ref<boolean>(!props.experience)
const experienceToUpdate = ref<IProfessionalExperienceRequest>(
  props.experience || {
    enterprise: '',
    role: '',
    dateRange: { begin: '', end: '' }
  }
)

const formValidator = ref<FormValidator<Partial<IProfessionalExperienceRequest & IFlexibleDateRange>>>(
  useValidator().createFormValidator<Partial<IProfessionalExperienceRequest & IFlexibleDateRange>>({
    enterprise: {
      getter: () => experienceToUpdate.value.enterprise,
      validate: (enterprise?: string) => (enterprise ? [] : ["Veuillez renseigner le nom de l'entreprise"])
    },
    role: {
      getter: () => experienceToUpdate.value.role,
      validate: (role?: string) => (role ? [] : ["Veuillez renseigner votre rôle dans l'entreprise"])
    },
    begin: {
      getter: () => formatedDateRange.value.begin,
      validate: (begin?: string) => (begin ? [] : ["Vous devez renseigner au moins la date de début de l'expérience"])
    },
    end: {
      getter: () => formatedDateRange.value.end,
      validate: (end?: string) => (isOngoingExperience.value || end ? [] : ["Vous devez renseigner la date de fin de l'expérience"])
    }
  })
)

const formatedDateRange = ref<IFlexibleDateRange>(preFormatDateRange(experienceToUpdate.value.dateRange))

function preFormatDateRange(dateRange: IFlexibleDateRange): IFlexibleDateRange {
  const begin = (dateRange.begin && useUtils().dates.formatStrDate(dateRange.begin, 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy')) || ''
  const end = (dateRange.end && useUtils().dates.formatStrDate(dateRange.end, 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy')) || ''

  return { begin, end }
}

async function deleteExperience() {
  const currentStudies = useUtils().objects.clone(
    useSessionStore().getUser<IProfessionalUser>()?.professionalProfile.history.professionalExperiences || []
  ) as IProfessionalExperienceRequest[]

  // Trouver l'index de l'étude à supprimer
  const index = currentStudies.findIndex((experience) => experience.id === props.experience?.id)

  if (index !== -1) {
    currentStudies.splice(index, 1)
    if (formValidator.value.validateForm() && formValidator.value.hasAnyErrors()) return

    // format current experiences dates
    formatStudiesDates(currentStudies)

    // format updated experience dates
    experienceToUpdate.value.dateRange = {
      begin: `${formatedDateRange.value.begin} 12:00`,
      end: !isOngoingExperience.value && formatedDateRange.value.end ? `${formatedDateRange.value.end} 12:00` : undefined
    }

    // Mettre à jour la liste des études via l'API
    const result = await useAPI().professionals.updateProfile(['professionalExperiences'], { professionalExperiences: currentStudies })

    if (result.error) {
      return
    }

    deleteEmit()
  }
}

async function saveExperience() {
  if (formValidator.value.validateForm() && formValidator.value.hasAnyErrors()) return

  // fetching current experiences
  const currentStudies = useUtils().objects.clone(
    useSessionStore().getUser<IProfessionalUser>()?.professionalProfile.history.professionalExperiences || []
  ) as IProfessionalExperienceRequest[]

  // format current experiences dates
  formatStudiesDates(currentStudies)

  // format updated experience dates
  experienceToUpdate.value.dateRange = {
    begin: `${formatedDateRange.value.begin} 12:00`,
    end: !isOngoingExperience.value && formatedDateRange.value.end ? `${formatedDateRange.value.end} 12:00` : undefined
  }

  // adding updated experience
  if (isCreatingNewExperience.value) currentStudies.push(experienceToUpdate.value)
  else {
    const index = currentStudies.findIndex((experience) => experience.id === experienceToUpdate.value.id)
    if (index < 0) return

    currentStudies[index] = experienceToUpdate.value
  }

  // do API call
  const { error } = await useAPI().professionals.updateProfile(['professionalExperiences'], { professionalExperiences: currentStudies })
  if (error) return

  // emit result
  if (isCreatingNewExperience.value) emit('added')
  else emit('updated')
}

function formatStudiesDates(experiences: IProfessionalExperienceRequest[]) {
  for (const experience of experiences) {
    const formatedBegin = useUtils().dates.formatStrDate(experience.dateRange.begin, 'dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy HH:mm')
    if (!formatedBegin) return

    let formatedEnd: string | undefined
    if (experience.dateRange.end)
      formatedEnd = useUtils().dates.formatStrDate(experience.dateRange.end, 'dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy HH:mm') || undefined

    experience.dateRange = {
      begin: formatedBegin,
      end: formatedEnd
    }
  }
}

function cancel() {
  emit('cancel')
}

function deleteEmit() {
  emit('deleted')
}
</script>

<style lang="scss" scoped>
.modalExperience {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;

  &__date {
    display: flex;
    flex-grow: 1;
    gap: $spacing-5;
    justify-content: flex-start;

    &--input {
      flex-grow: 1;
      width: 0;

      .input-content {
        width: 100%;
      }
    }
  }

  &__buttons {
    display: flex;
    gap: $spacing-5;
    justify-content: center;
    margin-top: $spacing-3;
  }

  &__currentExperience {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: $spacing-2;
  }
}

.customButton {
  width: 150px;
}

@media (max-width: 900px) {
  .modalExperience__date {
    flex-direction: column;
    gap: $spacing-2;
  }
}
</style>
