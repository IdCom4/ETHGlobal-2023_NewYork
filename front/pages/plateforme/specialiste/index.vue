<template>
  <div>
    <header-landing
      :subtitle="headerValue.subtitle"
      :title="headerValue.title"
      :link="headerValue.link"
      :background-image="headerValue.backgroundImage"
      :alt-background-image="headerValue.altBackgroundImage"
    />
    <main>
      <grow-business-section />
      <focus-activity-section />
      <strengthen-visibility-section />
      <follow-us-landing />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { GlobalEventTypes } from '@/types/constants'

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'light')
})

const headerValue = {
  title: "ValueMyCar, La Plateforme de Mise en relation de l'Automobile",
  subtitle: 'Mécaniciens, Carrossiers, Detailers, Spécialistes du lavage...',
  link: '/plateforme/automobiliste/nouvelle-demande',
  backgroundImage: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Landings-pages_center/centre/BGZFE8065.webp',
  altBackgroundImage: 'Photo du center ValueMyCar'
}
</script>

<style scoped lang="scss"></style>
