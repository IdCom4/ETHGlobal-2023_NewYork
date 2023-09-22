<template>
  <section v-if="currentUser">
    <div class="informations">
      <div class="informations__section">
        <Fa :icon="['fas', 'bolt-lightning']" />
        <p>{{ legalFormMessage }}</p>
        <professional-reviews-stars class="--mobile" :reviews="currentUser.professionalProfile.clientReviews || []" />
      </div>
      <div class="informations__section">
        <Fa :icon="['fas', 'car']" />
        <p>{{ messageMissions }}</p>
      </div>
      <div class="informations__section">
        <Fa :icon="['fas', 'location-dot']" />
        <p>{{ address }}</p>
      </div>
      <div class="informations__details --desktop">
        <div class="informations__details--views">
          {{ messageFavorites }}
        </div>

        <div class="informations__details--actions">
          <div class="availability">
            <span class="availability-title">Disponibilités </span>{{ currentUser.professionalProfile.averageAvailability }}
          </div>
          <div class="editPublicProfil"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as () => IProfessionalUser,
    required: true
  }
})

const currentUser = ref<IProfessionalUser>(props.user)
watch(
  () => props.user,
  () => {
    currentUser.value = props.user
  }
)

const legalFormMessage = ref<string>('')
const messageMissions = ref<string>('')
const messageFavorites = ref<string>('')

const nbMissions = computed(() => currentUser.value.professionalProfile?.nbrFinishedMissions || 0)
const billingAddress = computed(() => currentUser.value.professionalProfile?.workAddress ?? null)
const address = computed(() => {
  if (!billingAddress.value) return 'Aucune adresse renseignée'
  else return `${billingAddress.value.street}, ${billingAddress.value.zipCode} ${billingAddress.value.city}`
})

/* <=========== Display the number of missions completed */
if (nbMissions.value === 0) messageMissions.value = 'Aucune mission réalisée'
else if (nbMissions.value === 1) messageMissions.value = '1 mission réalisée'
else messageMissions.value = nbMissions.value + ' missions réalisées'
/* >=========== Display the number of missions completed */

if (currentUser.value.professionalProfile?.company?.legalForm === '') {
  legalFormMessage.value = currentUser.value.professionalProfile?.company?.legalForm
} else legalFormMessage.value = "Pas d'entreprise"

/* <=========== update message of favorite */
if (currentUser.value.professionalProfile?.isFavoriteOf?.length === 0) {
  messageFavorites.value = "Aucune personne n'a ajouté ce profil en favori"
} else if (currentUser.value.professionalProfile?.isFavoriteOf?.length === 1) {
  messageFavorites.value = '1 personne a ajouté ce profil en favoris'
} else {
  messageFavorites.value = currentUser.value.professionalProfile?.isFavoriteOf?.length + ' personnes ont ajouté ce profil en favoris'
}
/* >=========== update message of favorite */
</script>

<style lang="scss" scoped>
.informations {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  padding-bottom: $spacing-2;
  font-size: $font-size-3;

  &__section {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    color: $white;
  }
}

p {
  font-size: $font-size-3;
  font-weight: $font-weight-1;
}

.fa {
  color: $color-neon-blue;
}
.informations__status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-3;
  flex-wrap: wrap;
  margin-top: $spacing-5;
}

.--mobile {
  display: block;
}
.--desktop {
  display: none;
}

@media (min-width: 950px) {
  .--mobile {
    display: none;
  }
  .--desktop {
    display: block;
  }
  .informations {
    padding-bottom: 0;
  }
  .informations__details {
    display: flex;
    justify-content: space-between;
    color: $white;
    font-family: $main-font;
    flex-wrap: wrap;

    &--actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: fit-content;
    }

    &--views,
    &--actions {
      margin-top: $spacing-2;
      white-space: nowrap;
    }

    &--views {
      font-size: $font-size-3;
      font-weight: $font-weight-4;
      flex-grow: 1;
    }
  }

  .availability {
    text-align: end;
    font-weight: $font-weight-4;
  }
  .availability-title {
    color: $color-neon-blue;
    font-weight: $font-weight-1;
  }
  .editPublicProfil {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-2;
    font-size: $font-size-3;
  }

  .informations__status {
    margin-top: 0;
  }

  #edit {
    color: $white;
  }
}
</style>
