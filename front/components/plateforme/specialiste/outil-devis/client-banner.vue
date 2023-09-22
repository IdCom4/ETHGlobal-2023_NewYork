<template>
  <header class="client-banner">
    <div class="client-banner-wrapper">
      <div class="client-banner-layout shadowbox">
        <img
          class="client-banner-layout__img"
          :src="clientRequest.client.picture.fileURL"
          :alt="`photo de ${clientRequest.client.name} ${clientRequest.client.lastName}`"
        />
        <div class="client-banner-layout__user">
          <h2 class="client-banner-layout__user--name">
            <span>{{ clientRequest.client.name }}</span> &nbsp; <span> {{ clientRequest.client.lastName }}</span>
          </h2>

          <div class="client-banner-layout__user--infos">
            <div>
              <fa class="icon" icon="fa-solid fa-car" />
              <span>{{ clientRequest.vehicle.brand }} {{ clientRequest.vehicle.model }} | {{ clientRequest.vehicle.plate }}</span>
            </div>
            <div>
              <fa class="icon" icon="fa-solid fa-bolt" />
              <span>{{ clientRequest.idealStartingMoment }}</span>
            </div>
            <div>
              <fa class="icon" icon="fa-solid fa-location-dot" />
              <span>{{ useUtils().address.addressToString(clientRequest.idealPickupAddress) }}</span>
            </div>
          </div>

          <ul class="client-banner-layout__user--issues">
            <li v-for="(issue, index) in clientRequest.issues" :key="`issue-${index}`">
              {{ issue.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- WAITING FOR THE MAINTENANCE BOOK -->

    <!-- <div class="client-banner-details shadowbox">
      <div class="client-banner-details__plate-block">
        <span>Immatriculation</span> &nbsp; <span class="client-banner-details__plate-block--plate">{{ clientRequest.vehicle.plate }}</span>
      </div>
      <a class="client-banner-details__maintenance-book-link" target="_blank" :href="clientRequest.client._id" title="Télécharger le carnet d'entretient">
        <div class="client-banner-details__maintenance-book-link--content">
          <fa class="icon" icon="fa-solid fa-book" />
          <span>Carnet d'entretien</span>
        </div>
      </a>
    </div> -->
  </header>
</template>

<script setup lang="ts">
defineProps({
  clientRequest: {
    type: Object as PropType<IPopulatedMissionClientRequest>,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.client-banner {
  width: 100%;
  margin-bottom: 60px;
}

.client-banner-wrapper {
  background: $color-dark-blue;
}
.client-banner-layout {
  display: flex;
  max-width: 1220px;
  margin: auto;
  gap: $spacing-3;
  padding: 0;
  &__img {
    height: 275px;
  }
  &__user {
    padding: 35px 20px;
    &--name {
      color: $color-neon-blue;
      margin-bottom: 35px;
      & > * {
        font-family: 'Montserrat';
        font-size: 23px;
        font-weight: 700;
      }
      :first-child {
        text-transform: capitalize;
      }
    }
    &--infos {
      color: #fff;
      margin-bottom: 30px;
      & > * {
        margin-bottom: 10px;
        .icon {
          color: $color-neon-blue;
          margin-right: 10px;
        }
        span {
          font-family: 'Nunito';
          font-size: 14px;
          font-weight: 300;
        }
      }
    }
    &--issues {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      width: auto;
      color: #000;
      li {
        width: fit-content;
        text-align: center;
        white-space: nowrap;
        padding: 2px 17px;
        font-family: 'Montserrat';
        text-transform: uppercase;
        font-style: italic;
        font-size: 12px;
        font-weight: 500;
        background-color: #fff;
      }
    }
  }
}

// WAITING FOR THE MAINTENANCE BOOK
// .client-banner-details {
//   display: flex;
//   text-align: center;
//   max-width: 1220px;
//   margin: auto;
//   & > * {
//     width: 50%;
//     padding: 30px 0;
//   }
//   &__plate-block {
//     background-color: $color-neon-blue;
//     & > * {
//       font-size: 14px;
//     }
//     &--plate {
//       font-weight: 800;
//     }
//   }
//   &__maintenance-book-link {
//     background-color: #fff;
//     cursor: pointer;
//     transition: 0.3s;
//     &--content {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: #000;
//       & > :first-child {
//         margin-right: 10px;
//       }
//       span {
//         transition: 0.3s;
//       }
//     }
//     &:hover {
//       transform: scale(1.02);
//       box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
//     }
//     &:hover &--content {
//       span {
//         font-weight: 700;
//       }
//     }
//   }
// }

@media screen and (max-width: 1200px) {
  .client-banner {
    display: none;
  }
}
</style>
