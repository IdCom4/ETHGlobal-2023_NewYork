<template>
  <section id="page-layout">
    <user-alert />
    <login-modal />
    <navbar />
    <!-- pages -->
    <NuxtPage />
    <vmc-footer />
    <bottombar-center book-link="/centres/reservation" />
    <rgpd-consent />
  </section>
</template>

<script setup></script>

<style lang="scss">
#page-layout {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;

  overflow: hidden;

  position: relative;
}
</style>
