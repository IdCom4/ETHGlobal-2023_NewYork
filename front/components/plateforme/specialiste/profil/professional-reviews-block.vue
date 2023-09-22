<template>
  <div class="reviews">
    <h3 class="title">Avis</h3>
    <div v-if="clientReviews?.length !== 0" class="rewiewloop">
      <div v-for="(clientReview, index) in clientReviews" :key="`client-review-${index}`">
        <professional-single-review :review="clientReview" />
      </div>
      <!-- <NuxtLink to="/plateforme/specialiste/mes-missions" class="link"><fa icon="fa-regular fa-thumbs-up" />Demandez une recommandation</NuxtLink> -->
    </div>
    <div v-else><p>Aucun avis</p></div>
  </div>
</template>

<script setup lang="ts">
const clientReviews = useSessionStore().getUser<IProfessionalUser>()?.professionalProfile.clientReviews || []
</script>

<style lang="scss" scoped>
.reviews {
  border: 1px solid $black;
  padding: 20px;
}

.link {
  color: $black;
  display: flex;
  gap: $spacing-2;
}
.rewiewloop {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  padding-top: 20px;
}

@media (min-width: 900px) and (max-width: 1220px) {
  .reviews {
    padding: 0 20px 20px;
  }
}

@media (max-width: 900px) {
  .reviews {
    border: none;
  }
}
</style>
