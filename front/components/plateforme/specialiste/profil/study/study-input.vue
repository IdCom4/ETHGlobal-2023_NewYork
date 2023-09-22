<template>
  <section class="modalStudy">
    <!-- BASE DATA -->
    <vmc-input
      v-model="studyToUpdate.grade"
      type="text"
      modal-style
      label="Diplome"
      :error="formValidator.getErrorsOf('grade')[0]"
      @input="formValidator.validateOne('grade')"
    />
    <vmc-input
      v-model="studyToUpdate.schoolName"
      type="text"
      modal-style
      label="Nom de l'école"
      :error="formValidator.getErrorsOf('schoolName')[0]"
      @input="formValidator.validateOne('schoolName')"
    />
    <vmc-input v-model="studyToUpdate.description" type="text" modal-style label="Description" />
    <vmc-input v-model="studyToUpdate.schoolAddress" type="address" modal-style label="Adresse de l'école" />

    <!-- IS CURRENT STUDY -->
    <div class="modalStudy__currentStudy">
      <p class="modalStudy__currentStudy--text">J'occupe actuellement ce poste</p>
      <vmc-input v-model="isOngoingStudy" type="toggle" modal-style label="Description" />
    </div>

    <!-- DATE RANGE -->
    <div class="modalStudy__date">
      <vmc-input
        v-model="formatedDateRange.begin"
        type="date"
        modal-style
        label="Date de début"
        :error="formValidator.getErrorsOf('begin')[0]"
        @input="formValidator.validateOne('begin')"
      />
      <vmc-input
        v-if="!isOngoingStudy"
        v-model="formatedDateRange.end"
        type="date"
        modal-style
        label="Date de fin"
        :error="formValidator.getErrorsOf('end')[0]"
        @input="formValidator.validateOne('end')"
      />
    </div>

    <!-- ACTION BUTTONS -->
    <div class="modalStudy__buttons">
      <button v-if="!isCreatingNewStudy" class="customButton btn_denied" @click="deleteStudy">Supprimer</button>
      <button v-else class="customButton btn_denied" @click="cancel">Annuler</button>
      <button class="customButton btn_call-to-action" @click="saveStudy">Enregistrer</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IStudyRequest } from '@/composables/resources/api-endpoints/professionals.endpoint'
import { FormValidator } from '@/composables/useValidator'

const emit = defineEmits(['added', 'updated', 'deleted', 'cancel'])
const props = defineProps({ study: { type: Object as PropType<IStudy | null>, default: null } })

const isOngoingStudy = ref<boolean>(!!props.study && !props.study.dateRange.end)
const isCreatingNewStudy = ref<boolean>(!props.study)
const studyToUpdate = ref<IStudyRequest>(
  props.study || {
    grade: '',
    schoolName: '',
    description: '',
    dateRange: { begin: '', end: '' }
  }
)

const formValidator = ref<FormValidator<Partial<IStudyRequest & IFlexibleDateRange>>>(
  useValidator().createFormValidator<Partial<IStudyRequest & IFlexibleDateRange>>({
    grade: {
      getter: () => studyToUpdate.value.grade,
      validate: (grade?: string) => (grade ? [] : ['Veuillez renseigner le diplôme'])
    },
    schoolName: {
      getter: () => studyToUpdate.value.schoolName,
      validate: (schoolName?: string) => (schoolName ? [] : ["Veuillez renseigner le nom de l'école"])
    },
    begin: {
      getter: () => formatedDateRange.value.begin,
      validate: (begin?: string) => (begin ? [] : ['Vous devez renseigner au moins la date de début de la formation'])
    },
    end: {
      getter: () => formatedDateRange.value.end,
      validate: (end?: string) => (isOngoingStudy.value || end ? [] : ['Vous devez renseigner la date de fin de la formation'])
    }
  })
)

const formatedDateRange = ref<IFlexibleDateRange>(preFormatDateRange(studyToUpdate.value.dateRange))

function preFormatDateRange(dateRange: IFlexibleDateRange): IFlexibleDateRange {
  const begin = (dateRange.begin && useUtils().dates.formatStrDate(dateRange.begin, 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy')) || ''
  const end = (dateRange.end && useUtils().dates.formatStrDate(dateRange.end, 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy')) || ''

  return { begin, end }
}

async function deleteStudy() {
  if (!props.study) return

  const currentStudies = useUtils().objects.clone(
    useSessionStore().getUser<IProfessionalUser>()?.professionalProfile.history.studies || []
  ) as IStudyRequest[]

  // Trouver l'index de l'étude à supprimer
  const index = currentStudies.findIndex((study) => study.id === props.study?.id)

  if (index !== -1) {
    currentStudies.splice(index, 1)
    if (formValidator.value.validateForm() && formValidator.value.hasAnyErrors()) return

    // format current studies dates
    formatStudiesDates(currentStudies)

    // format updated study dates
    studyToUpdate.value.dateRange = {
      begin: `${formatedDateRange.value.begin} 12:00`,
      end: !isOngoingStudy.value && formatedDateRange.value.end ? `${formatedDateRange.value.end} 12:00` : undefined
    }

    // Mettre à jour la liste des études via l'API
    const result = await useAPI().professionals.updateProfile(['studies'], { studies: currentStudies })

    if (result.error) {
      return
    }

    deleteEmit()
  }
}

async function saveStudy() {
  if (formValidator.value.validateForm() && formValidator.value.hasAnyErrors()) return

  // fetching current studies
  const currentStudies = useUtils().objects.clone(
    useSessionStore().getUser<IProfessionalUser>()?.professionalProfile.history.studies || []
  ) as IStudyRequest[]

  // format current studies dates
  formatStudiesDates(currentStudies)

  // format updated study dates
  studyToUpdate.value.dateRange = {
    begin: `${formatedDateRange.value.begin} 12:00`,
    end: !isOngoingStudy.value && formatedDateRange.value.end ? `${formatedDateRange.value.end} 12:00` : undefined
  }

  // adding updated study
  if (isCreatingNewStudy.value) currentStudies.push(studyToUpdate.value)
  else {
    const index = currentStudies.findIndex((study) => study.id === studyToUpdate.value.id)
    if (index < 0) return

    currentStudies[index] = studyToUpdate.value
  }

  // do API call
  const { error } = await useAPI().professionals.updateProfile(['studies'], { studies: currentStudies })
  if (error) return

  // emit result
  if (isCreatingNewStudy.value) emit('added')
  else emit('updated')
}

function formatStudiesDates(studies: IStudyRequest[]) {
  for (const study of studies) {
    const formatedBegin = useUtils().dates.formatStrDate(study.dateRange.begin, 'dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy HH:mm')
    if (!formatedBegin) return

    let formatedEnd: string | undefined
    if (study.dateRange.end) formatedEnd = useUtils().dates.formatStrDate(study.dateRange.end, 'dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy HH:mm') || undefined

    study.dateRange = {
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
.modalStudy {
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

  &__currentStudy {
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
  .modalStudy__date {
    flex-direction: column;
    gap: $spacing-2;
  }
}
</style>
