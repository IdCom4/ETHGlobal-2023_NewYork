<template>
  <section class="myVehicles">
    <h3>Mes véhicules</h3>
    <router-link :to="`/plateforme/automobiliste/profil/mes-vehicules`">
      <button class="btn btn_call-to-action">Accéder à mes véhicules</button>
    </router-link>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.btn {
  width: 100%;
}

h3 {
  margin-top: $spacing-3;
}

@media (min-width: 900px) {
  h3 {
    margin-top: $spacing-3;
    margin-bottom: $spacing-4;
  }
  .myVehicles {
    border: 1px solid black;
    padding: 0 20px 20px;
  }
}
</style>
