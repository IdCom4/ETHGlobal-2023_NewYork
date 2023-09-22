<template>
  <div class="user-quote">
    <span>Devis à destination de</span>
    <div class="user">
      <img :src="`${clientRequest.client.picture.fileURL}`" :alt="`photo de ${clientRequest.client.name} ${clientRequest.client.lastName}`" />
      <div class="user__values">
        <div class="user__values--fullname">
          <span>{{ `${clientRequest.client.name}` }}</span> <span>{{ `${clientRequest.client.lastName}` }}</span>
        </div>
        <div class="user__values--infos">
          <fa class="icon" :icon="['fas', 'car']" />
          <div>{{ `${clientRequest.vehicle.brand} ${clientRequest.vehicle.model}` }}</div>
        </div>
        <div class="user__values--infos">
          <fa class="icon" :icon="['fas', 'bolt']" />
          <div>{{ clientRequest.idealStartingMoment }}</div>
        </div>
        <div class="user__values--infos">
          <fa class="icon" :icon="['fas', 'location-dot']" />
          <div>
            {{ useUtils().address.addressToString(clientRequest.idealPickupAddress) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  clientRequest: {
    type: Object as PropType<IPopulatedMissionClientRequest>,
    default: () => ({})
  },
  mobile: {
    typre: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.user-quote {
  max-width: 360px;
  .user {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: -15px;
    img {
      width: 87px;
      height: 87px;
      object-fit: cover;
    }
    &__values {
      &--fullname {
        font-family: 'Montserrat';
        margin-bottom: 7px;
        & > * {
          font-size: 14px;
          font-weight: 700;
          font-style: italic;
        }
        :nth-child(2) {
          text-transform: uppercase;
        }
      }
      &--infos {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: 'Nunito';
        font-size: 12px;
        .icon {
          width: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .user-quote {
    max-width: 100%;
    padding: 20px;
    background-color: $color-dark-blue;
    color: #fff;
    > :first-child {
      display: inline-block;
      height: 35px;
    }
    .user {
      width: 100%;
      &__values {
        width: 80%;
        &--fullname {
          color: $color-neon-blue;
        }
        &--infos {
          max-width: 80%;
          overflow: hidden;
          .icon {
            color: $color-neon-blue;
          }
          :nth-child(2) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
