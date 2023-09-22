<template>
  <section v-if="updatedUser" id="user-profile-page">
    <header-profile :user="updatedUser" @update-logo="handleUpdateLogo" />
    <div class="wrapperMobile">
      <user-informations :user="updatedUser" @update-user="handleUpdateUser" />
      <user-coordinates :user="updatedUser" @update-user="handleUpdateUser" />
      <user-password :user="updatedUser" />
      <user-vehicles />
      <payment-method />
    </div>

    <div class="wrapperDesktop">
      <div class="containerFlex">
        <user-vehicles />
        <payment-method />
      </div>
      <div class="containerFlex">
        <user-informations :user="updatedUser" @update-user="handleUpdateUser" />
        <user-coordinates :user="updatedUser" @update-user="handleUpdateUser" />
        <user-password :user="updatedUser" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { GlobalEventTypes } from '@/types/constants'

definePageMeta({ middleware: ['is-authenticated'] })

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'dark')
})

const profil = ref<IUser | null>()
const fetchProfile = async () => {
  const { data } = await useAPI().users.getProfile()
  profil.value = data
  updatedUser.value = data

  return updatedUser.value
}

fetchProfile()
/* <=========== User connected verification */

/* >=========== Initialization variables */
const updatedUser = ref<IUser | null>(profil.value ?? null)

/* <=========== Initialization variables */

/* >=========== Update user */
const isUpdatingProfile = ref(false) // Variable de contrôle

const handleUpdateUser = async (fieldToUpdate: keyof IUpdateProfileRequest, value: string | IAddress | null | undefined) => {
  if (isUpdatingProfile.value || value === null) return

  isUpdatingProfile.value = true

  let updateUserRequest: IUpdateProfileRequest = {}

  if (fieldToUpdate === 'homeAddress') {
    const address = value as IAddress
    updateUserRequest = {
      [fieldToUpdate]: address
    }
  } else {
    updateUserRequest = {
      [fieldToUpdate]: value as string
    }
  }

  const response = await useAPI().users.updateProfile(updateUserRequest)
  updatedUser.value = response.data

  isUpdatingProfile.value = false
}

const handleUpdateLogo = (newImageUrl: string) => {
  if (profil.value === null || profil.value === undefined || profil.value.picture === null || profil.value.picture === undefined) return
  else profil.value.picture.fileURL = newImageUrl
}
</script>

<style lang="scss" scoped>
section#user-profile-page {
  padding: 0;
}

.wrapperDesktop {
  display: none;
}

.wrapperMobile {
  display: block;
  padding: 20px 20px 50px 20px;
}

@media (min-width: 900px) {
  .wrapperDesktop {
    display: block;
  }

  .wrapperMobile {
    display: none;
  }
  .wrapperDesktop {
    padding: 75px 20px;
    max-width: 1220px;
    margin: auto;
    display: grid;
    grid-template-columns: 0.5fr 1.5fr;
    grid-auto-rows: min-content;
    gap: 20px 20px;
  }

  .containerFlex {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
