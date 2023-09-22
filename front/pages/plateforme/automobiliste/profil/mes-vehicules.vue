<template>
  <div v-if="profile">
    <header-profile :user="profile" />

    <main class="my-vehicles">
      <div class="my-vehicles-content">
        <h3 class="my-vehicles-content__title">Mes véhicules</h3>
        <div v-for="vehicle in vehicles" :key="`vehicles-list_${vehicle._id}`" class="my-vehicles-content__vehicles-list">
          <div class="my-vehicles-content__vehicles-list--informations">
            <vehicle-updatable-card :vehicle="vehicle" @updated="fetchMyVehicles" @deleted="fetchMyVehicles" />
          </div>

          <vehicle-invoices-list :vehicle="vehicle" />
        </div>

        <button class="my-vehicles-content__add-vehicle-btn-mobile btn btn_call-to-action" @click="isModalVehiclesOpen = true">
          Ajoutez un véhicule
        </button>
        <button title="Ajoutez un véhicule" class="my-vehicles-content__add-vehicle-btn-desktop btn_functional" @click="isModalVehiclesOpen = true">
          <fa icon="fa-solid fa-plus" class="icon" />Ajoutez un véhicule
        </button>
      </div>
      <vmc-modal :is-open="isModalVehiclesOpen" title="Ajoutez un véhicule" max-width="500px" @close="isModalVehiclesOpen = false">
        <vehicle-input @cancel="isModalVehiclesOpen = false" @created="closeModalAndRefreshVehicles" />
      </vmc-modal>
    </main>
  </div>
</template>

<script lang="ts" setup>
/* <=========== user connected verification */
definePageMeta({ middleware: ['is-authenticated'] })

const profile = ref<IUser | null>(null)
const vehicles = ref<IOwnerVehicle[]>([])
const isModalVehiclesOpen = ref<boolean>(false)

fetchProfile()
fetchMyVehicles()

function closeModalAndRefreshVehicles() {
  isModalVehiclesOpen.value = false
  fetchMyVehicles()
}

async function fetchProfile() {
  const { data } = await useAPI().users.getProfile()
  profile.value = data
}

async function fetchMyVehicles() {
  const response = await useAPI().vehicles.getMyVehicles()
  if (response.data) {
    vehicles.value = response.data
  }
}
</script>

<style lang="scss" scoped>
.my-vehicles {
  padding: 20px 20px;
  width: 100%;
  max-width: 1220px;
  margin: 50px auto;
}

.my-vehicles-content {
  padding: 20px;
  border: solid 0.5px;
  &__title {
    margin-bottom: $spacing-4;
  }
  &__vehicles-list {
    margin-bottom: $spacing-5;
    &--informations {
      display: flex;
      flex-direction: column;
      gap: $spacing-1;
      &--title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  &__add-vehicle-btn-desktop {
    display: block;
  }
  &__add-vehicle-btn-mobile {
    display: none;
  }
}

@media (max-width: 700px) {
  .my-vehicles-content__add-vehicle-btn-mobile {
    display: block;
    width: 100%;
    color: $color-dark-blue !important;
  }
  .my-vehicles-content__add-vehicle-btn-desktop {
    display: none;
  }
}
</style>
