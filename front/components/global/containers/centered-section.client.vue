<template>
  <section class="centered-section">
    <div class="centered-section__container">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.centered-section {
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 2rem auto;
  padding: 0 1.5rem;
  width: 100%;
}

.centered-section__container {
  max-width: 1220px;
  width: 100%;
}
</style>
