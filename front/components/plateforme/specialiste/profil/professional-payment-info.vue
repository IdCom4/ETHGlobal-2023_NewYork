<template>
  <div class="professional-infos">
    <h3 class="top-bottom">Informations de paiement</h3>
    <div class="content">
      <vmc-modal max-width="500px" title="Informations de paiement" :is-open="modalOpen" @close="modalOpen = false">
        <professional-payment-info-modal-content />
      </vmc-modal>
      <p class="verification-status">Vous n'avez pas renseigné vos informations de paiements</p>
      <button class="btn_call-to-action" @click="modalOpen = true">Renseigner mes informations</button>
      <p class="informations">Ces informations sont requises pour proposer des devis et recevoir vos paiements</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const modalOpen = ref<boolean>(false)
</script>
<style lang="scss" scoped>
.professional-infos {
  border: solid 1px $color-grey;
  padding: 0 20px 20px;
  width: 100%;

  h3 {
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .informations {
    text-align: center;
  }
}

@media (max-width: 900px) {
  .professional-infos {
    border: none;
  }
}
</style>
