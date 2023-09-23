<template>
  <!-- pages -->
  <eth-navbar />

  <div class="main-content">
    <h2>404</h2>
    <p class="largest">Whoops, something went wrong</p>
    <NuxtLink to="/">
      <button class="btn_call-to-action">Home</button>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
h4 {
  text-align: center;
  font-weight: 700;
  margin: 10px 0px;
}

.main-content {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
  gap: 25px;
  width: 500px;
  max-width: calc(100% - 20px);

  p {
    text-align: center;
  }
}
</style>
