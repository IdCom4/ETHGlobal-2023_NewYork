<template>
  <div class="professionalSkills">
    <h3>COMPÉTENCES</h3>
    <div class="professionalSkills__list">
      <div class="professionalSkills__list--skills">
        <professional-skills-dropdown
          v-for="(category, index) of Object.values(SkillCategories)"
          :key="`skill-${index}`"
          v-model="selectedSkills"
          class="skill-dropdown"
          :skills="skillsByCategory[category]"
          :category="category"
        />
      </div>

      <button class="btn_call-to-action" @click="updateProfile">Sauvegarder</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IUpdateProfessionalProfileRequest } from '@/composables/resources/api-endpoints/professionals.endpoint'
import { AlertModes } from '@/types/constants'
import { SkillCategories } from '@/types/constants/models/skill' // Adjust the path to the actual location

defineExpose({ updateProfile })

const user = useSessionStore().getUser<IProfessionalUser>()

const selectedSkills = ref<ISkill[]>([])
const allSkills = ref<ISkill[]>([])
const skillsByCategory = ref<Record<string, ISkill[]>>({})

// Function to replicate the behavior of opening the professional modal
const initializeSkillsPage = async () => {
  const { data } = await useAPI().skills.getSkills()
  if (!data) return

  allSkills.value = data

  const allCategories = Object.values(SkillCategories)

  for (const category of allCategories) skillsByCategory.value[category] = allSkills.value.filter((skill) => skill.categories.includes(category))

  selectedSkills.value = allSkills.value.filter((skill) => !!user?.professionalProfile.skillIds?.includes(skill._id))
}

onMounted(initializeSkillsPage)

async function updateProfile() {
  // Récupérer les compétences sélectionnées
  const selectedSkillIds = selectedSkills.value.map((skill) => skill._id)

  // Définir les champs à mettre à jour et les valeurs à mettre à jour
  const fieldsToUpdate: (keyof IUpdateProfessionalProfileRequest)[] = ['skillIds']
  const fields: IUpdateProfessionalProfileRequest = { skillIds: selectedSkillIds }

  // Appeler l'API pour mettre à jour le profil
  await useAPI().professionals.updateProfile(fieldsToUpdate, fields, { mode: AlertModes.ALL, successMsg: 'Compétences mise à jour' })
}
</script>

<style lang="scss" scoped>
div.professionalSkills {
  border: 1px solid $black;
  padding: 20px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    align-items: center;

    &--skills {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      justify-items: center;
      grid-gap: $spacing-2;

      .skill-dropdown {
        width: 100%;
      }
    }
  }
}

@media (min-width: 900px) and (max-width: 1220px) {
  div.professionalSkills {
    padding: 0 20px 20px;
  }
}

@media (max-width: 900px) {
  div.professionalSkills {
    border: none;

    &__list--skills {
      flex-direction: column;
      align-items: flex-start; // Si nécessaire, pour aligner les éléments
    }

    .skill-dropdown {
      width: 100%;
    }
  }
}

@media (max-width: 700px) {
  div.professionalSkills {
    .skill-dropdown {
      border-bottom: 1px solid $black;
    }
  }
}
</style>
