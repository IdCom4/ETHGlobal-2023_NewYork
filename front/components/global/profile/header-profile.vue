<template>
  <header class="header-profil shadowbox">
    <div class="name">
      <div class="name__logo">
        <vmc-profile-picture :user="props.user" updatable @update-logo="handleUpdateLogo"></vmc-profile-picture>
      </div>
      <div class="wrapper">
        <h2 class="name__title">
          <span class="name__title_firstname">{{ props.user.name }}</span>
          &nbsp;
          <span class="name__title_lastname">{{ props.user.lastName }}</span>
        </h2>
        <div class="desktop">
          <div class="informations ">
            <div class="informations__missions">
              <fa :icon="['fas', 'car']" />
              <p class="informations__text">{{ messageMissions }}</p>
            </div>
            <div class="informations__address">
              <fa :icon="['fas', 'location-dot']" />
              <p class="informations__text">{{ formatAddress(props.user.homeAddress) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="informations mobile">
      <div class="informations__missions">
        <fa :icon="['fas', 'car']" />
        <p class="informations__text">{{ messageMissions }}</p>
      </div>
      <div class="informations__address">
        <fa :icon="['fas', 'location-dot']" />
        <p class="informations__text">{{ formatAddress(props.user.homeAddress) }}</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const emitEvent = defineEmits(['update-logo'])

const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true
  }
})

const nbMissions = ref<number>(props.user.missionClientProfile?.missionsId?.length || 0)
const messageMissions = ref<string>('')

// const homeAddress = ref<IAddress | null>(props.user.homeAddress ?? null)
if (nbMissions.value === 0) messageMissions.value = 'Aucune mission demandée'
else if (nbMissions.value === 1) messageMissions.value = '1 mission demandée'
else messageMissions.value = nbMissions.value + ' missions demandées'

const handleUpdateLogo = (newImageUrl: string) => {
  if (props.user.picture === null || props.user.picture === undefined) return
  else emitEvent('update-logo', newImageUrl)
}
const formatAddress = (address: IAddress | null | undefined) => {
  if (address === null || address === undefined) {
    return 'Aucune adresse renseignée'
  }
  return `${address.street}, ${address.zipCode} ${address.city}`
}
</script>

<style lang="scss" scoped>
.mobile {
  display: block;
}
.desktop {
  display: none;
}
.header-profil {
  position: relative;
  height: 200px;
  background: $color-dark-blue;
  padding: 0 20px;
}

.name {
  display: flex;
  align-items: flex-start;
  gap: $spacing-4;
  color: $color-neon-blue !important;
  padding: 20px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  &__title_firstname,
  &__title_lastname {
    font-size: $font-size-5;
    font-weight: 700;
  }
  &__title_firstname {
    text-transform: capitalize;
  }
}

.informations {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  &__text {
    font-weight: $font-weight-2;
  }

  &__address,
  &__missions {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    color: $white;
  }
}
.--icon {
  color: $color-neon-blue;
  width: 15px;
}

span.name__title_firstname,
span.name__title_lastname {
  font-size: $font-size-5;
}
@media (min-width: 900px) {
  .mobile {
    display: none;
  }
  .desktop {
    display: block;
  }
  .header-profil {
    padding: 0;
  }
  .name {
    position: relative;
    padding: 0 20px;
    height: 100%;
    max-width: 1220px;
    margin: auto;
    &__logo {
      height: 200px;
      width: 200px;
    }
    &__title {
      margin: $spacing-3 0;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-bottom: $spacing-3;
  }

  span.name__title_firstname,
  span.name__title_lastname {
    font-size: 23px;
  }
}
</style>
