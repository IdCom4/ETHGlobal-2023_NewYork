<template>
  <section class="modalExperience">
    <VmcInput v-model="experienceUpdate.role" type="text" modal-style label="Poste" />
    <VmcInput v-model="experienceUpdate.enterprise" type="text" modal-style label="Nom de l'entreprise" />
    <!-- <VmcInput v-model="experienceUpdate.description" type="text" modal-style label="Description" /> -->
    <div class="modalExperience__currentJob">
      <p class="modalExperience__currentJob--text">J'occupe actuellement ce poste</p>
      <VmcInput v-model="isCurrentJob" type="toggle" modal-style label="Description" />
    </div>
    <div class="modalExperience__date">
      <div class="modalExperience__date--input">
        <VmcInput v-model="beginDateFormatted" type="date" modal-style label="Date de début" />
      </div>
      <div v-if="!isCurrentJob" class="modalExperience__date--input">
        <VmcInput v-model="endDateFormatted" type="date" modal-style label="Date de fin" />
      </div>
      <div v-else class="modalExperience__date--input"></div>
    </div>
    <div v-if="isEditing" class="modalExperience__buttons">
      <button class="customButton btn_denied" @click="deleteExperience">Supprimer</button>
      <button class="customButton btn_call-to-action" @click="saveExperience">Modifier</button>
    </div>

    <div v-else class="modalExperience__buttons">
      <button class="customButton btn_denied" @click="closeModal">Annuler</button>
      <button class="customButton btn_call-to-action" @click="saveExperience">Enregistrer</button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  experience: { type: Object as () => IStudy | null, default: null }
})

interface ExperienceUpdate {
  role: string
  enterprise: string
  dateRange: {
    begin: string
    end: string
  }
}
const emit = defineEmits(['experience', 'close', 'deleteExperience'])

const experienceUpdate = ref<ExperienceUpdate>({ role: '', enterprise: '', dateRange: { begin: '', end: '' } })

if (props.experience) {
  experienceUpdate.value = { ...props.experience }
}

const closeModal = () => {
  emit('close')
}

const isEditing = ref(false)

watchEffect(() => {
  if (props.experience) {
    experienceUpdate.value = { ...props.experience }
    isEditing.value = true
  } else {
    isEditing.value = false
  }
})

const deleteExperience = () => {
  emit('deleteExperience', experienceUpdate.value)
}

const saveExperience = () => {
  if (
    experienceUpdate.value.role.trim() !== '' &&
    experienceUpdate.value.enterprise.trim() !== '' &&
    experienceUpdate.value.dateRange.begin !== '' &&
    (isCurrentJob.value || experienceUpdate.value.dateRange.end !== '')
  ) {
    emit('experience', experienceUpdate.value)
    closeModal()
  }
}

const isCurrentJob = ref(false)

const beginDateFormatted = ref('')
const endDateFormatted = ref('')

watchEffect(() => {
  if (beginDateFormatted.value !== '') {
    experienceUpdate.value.dateRange.begin = formatDateTime(beginDateFormatted.value, '00:00:00')
  }
  if (endDateFormatted.value !== '' && !isCurrentJob.value) {
    experienceUpdate.value.dateRange.end = formatDateTime(endDateFormatted.value, '00:00:00')
  }
})

if (props.experience) {
  beginDateFormatted.value = formatDate(experienceUpdate.value.dateRange.begin)
  endDateFormatted.value = formatDate(experienceUpdate.value.dateRange.end)
}

function formatDate(dateTime: string): string {
  return dateTime.slice(0, 10)
}

function formatDateTime(date: string, time: string): string {
  return `${date} ${time}`
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
    justify-content: space-between;

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

  &__currentJob {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: $spacing-2;
  }
}

.customButton {
  width: 150px;
}
</style>
