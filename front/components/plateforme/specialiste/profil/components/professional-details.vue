<template>
  <div class="footerHeaderWrapper">
    <div class="desktop-layout">
      <div class="footerHeader shadowbox">
        <div id="tarif" class="footerHeader__block">
          <p class="title">Tarif indicatif</p>
          <p class="description">{{ props.user.professionalProfile.averageHourlyRate }}€ HT / heure</p>
        </div>
        <div id="mobility" class="footerHeader__block">
          <p class="title">Mobilité</p>
          <p class="description">Peut se déplacer à {{ props.user.professionalProfile.maxTravelDistance }}km de sa position</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as () => IProfessionalUser,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.footerHeader {
  display: flex;
  width: 100%;
  max-width: 100%;

  #tarif {
    background-color: $color-neon-blue;
  }

  #mobility {
    background-color: $white;
  }
  &__block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: $spacing-4 $spacing-3;
    gap: $spacing-2;
    text-align: center;

    .title {
      font-size: $font-size-3;
    }
    .description {
      font-weight: $font-weight-4;
      font-size: $font-size-4;
    }
  }
}

.mobile-layout {
  display: flex;
  gap: $spacing-3;
  padding: 20px 0;
}
@media (min-width: 950px) {
  .footerHeaderWrapper {
    justify-content: center;
    width: 100%;
    margin: 0;
    padding: 0 20px;
  }
  .desktop-layout {
    max-width: 1220px;
    padding: 0px;
    margin: auto;
    display: flex;
  }

  .footerHeader__block {
    flex-direction: row;
    gap: $spacing-3;
  }
}
</style>
