<template>
  <section id="page-layout">
    <user-alert />
    <login-modal />
    <eth-navbar />
    <!-- pages -->
    <NuxtPage />
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
