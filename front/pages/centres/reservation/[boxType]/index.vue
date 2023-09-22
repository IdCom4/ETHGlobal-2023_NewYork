<template>
  <section id="reservation-page">
    <centre-reservation-booking-section />
  </section>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'
useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'light')
</script>

<style lang="scss" scoped></style>
