<template>
  <section class="experiences">
    <h3 class="experiences__title">Expérience</h3>
    <div class="experiences__addButton">
      <p class="experiences__addButton--text" @click="addExperience">
        <Fa icon="fa-solid fa-pencil" />
        Ajouter une experience
      </p>
    </div>
    <div v-if="experiences && experiences.length > 0" class="experiences__list">
      <Single-experience-specialist
        v-for="experience in experiences"
        :key="experience.id"
        :experience="experience"
        @changed-click="updateExperience(experience)"
      />
    </div>
    <div v-else class="experiences__noList">
      <p class="experiences__noList--text">Aucune experience disponible</p>
    </div>
  </section>

  <Vmc-modal :is-open="isModalOpen" title="Modification de votre mot de passe" max-width="500px" @close="closeModal">
    <modal-experience-specialist
      :experience="experienceModal"
      @experience="pushExperience"
      @close="closeModal"
      @delete-experience="deleteExperience"
    />
  </Vmc-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as PropType<IUser | null>,
    default: null
  }
})

const emit = defineEmits(['update'])

const experiences = ref<IStudy[]>([])
watch(props, (newProps) => {
  if (newProps.user?.professionalProfile?.history?.professionalExperiences) {
    experiences.value = newProps.user.professionalProfile.history.professionalExperiences
  } else {
    experiences.value = []
  }
})

const isModalOpen = ref<boolean>(false)

const experienceModal = ref<IStudy | null>(null)
const addExperience = () => {
  experienceModal.value = null
  openModal()
}
const updateExperience = (experience: IStudy | null) => {
  experienceModal.value = experience
  openModal()
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

async function setPayloadDates(experiencePayload: IStudy[]) {
  experiencePayload.forEach((elem) => {
    if (/\d{2}:\d{2}:\d{2}$/.test(elem.dateRange.begin)) {
      elem.dateRange.begin = elem.dateRange.begin.slice(0, -3)
    } else if (!/\d{2}:\d{2}$/.test(elem.dateRange.begin)) {
      elem.dateRange.begin = `${elem.dateRange.begin} 00:00`
    }

    if (/\d{2}:\d{2}:\d{2}$/.test(elem.dateRange.end)) {
      elem.dateRange.end = elem.dateRange.end.slice(0, -3)
    } else if (!/\d{2}:\d{2}$/.test(elem.dateRange.end)) {
      elem.dateRange.end = `${elem.dateRange.end} 00:00`
    }
  })
}

const pushExperience = async (experience: IStudy) => {
  if (experience.id !== undefined) {
    const index = experiences.value.findIndex((f) => f.id === experience.id)
    if (index !== -1) experiences.value[index] = experience
  } else {
    experiences.value.push(experience)
  }
  await updateExperiences()
  closeModal()
  emit('update')
}

const deleteExperience = async (experience: IStudy) => {
  experiences.value = experiences.value.filter((f) => f.id !== experience.id)
  await updateExperiences()
  closeModal()

  emit('update')
}

const currentId = ref<number>(0)

async function updateExperiences() {
  let experiencePayload = useUtils().objects.clone(experiences.value) as IStudy[]
  await setPayloadDates(experiencePayload)

  experiencePayload = experiencePayload.map((experience) => {
    if ('id' in experience) {
      const { id, ...rest } = experience
      currentId.value = id
      return rest
    }
    return experience
  })

  const result = await useAPI().professionals.updateProfile(['professionalExperiences'], { professionalExperiences: experiencePayload })

  if (result.error || !result.data === null) {
    return
  } else {
    experiences.value = result.data
  }
}
</script>

<style lang="scss" scoped>
.experiences {
  &__addButton {
    cursor: pointer;
    h4 {
      font-size: $font-size-2;
    }
  }

  &__noList {
    margin: $spacing-2 0;
    &--text {
      font-family: $main-font;
    }
  }
}
</style>
