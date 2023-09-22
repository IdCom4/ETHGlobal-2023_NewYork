<template>
  <div>
    <main>
      <header-landing
        :subtitle="headerValue.subtitle"
        :title="headerValue.title"
        :link="headerValue.link"
        :background-image="headerValue.backgroundImage"
        :alt-background-image="headerValue.altBackgroundImage"
      />
      <base-mission-request-input class="base-mission" />
      <find-professional-section />
      <compare-quote-section />
      <secured-payement-section />
      <service-book-section />
      <follow-us-landing />
    </main>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable prettier/prettier */
import { GlobalEventTypes } from '@/types/constants';

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'light')
})

const headerValue = {
  title: 'ValueMyCar, La Plateforme de Mise en relation de l\'Automobile',
  subtitle: 'Trouvez le spécialiste parfait pour votre véhicule !',
  link: '/plateforme/automobiliste/nouvelle-demande',
  backgroundImage: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/centre/BGZFE8065.webp',
  altBackgroundImage: 'Photo du center ValueMyCar'
}
</script>

<style scoped lang="scss">

.base-mission {
  position: relative;
  margin-top: -80px;
  width: calc(100% - 40px);
}

</style>
