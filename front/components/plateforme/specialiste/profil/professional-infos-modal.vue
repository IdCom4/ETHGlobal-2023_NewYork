<template>
  <div class="professional-infos">
    <div class="professional-infos__address">
      <h3>ADRESSE PROFESSIONNELLE</h3>
      <p>Indiquez l’adresse à laquelle vous souhaitez réaliser vos missions.</p>
      <p>Si vous êtes itinérant, renseignez l’adresse autour de laquelle vous souhaitez recevoir des missions.</p>
      <!-- Waiting for "vmc-input Component" -->
    </div>
    <div class="professional-infos__skills">
      <!-- Waiting for "skills Component" -->
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.professional-infos {
  margin: 80px;
  z-index: 999;
  background-color: #fff;
  border: solid 5px;
  &__address {
    display: grid;
    text-align: center;
    gap: 1em;
    p {
      font-style: italic;
    }
    p:first-of-type {
      font-style: normal;
      font-weight: bold;
    }
  }
}
</style>
