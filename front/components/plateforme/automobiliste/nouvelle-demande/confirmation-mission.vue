<template>
  <tracking-section>
    <div class="validate-section">
      <div>
        <label>Votre demande à bien été prise en compte.</label>
        <div>
          <p>Vous devriez recevoir des devis très prochainement.</p>
          <p>Merci pour votre confiance !</p>
        </div>
      </div>
      <h1></h1>
      <nuxt-link to="/plateforme/automobiliste/mes-demandes">
        <button class="btn_call-to-action">Suivre ma demande</button>
      </nuxt-link>
    </div>
  </tracking-section>
</template>
<style scoped lang="scss">
.validate-section {
  display: flex;
  flex-direction: column;
  gap: 60px;
  div {
    gap: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    div {
      max-width: 260px;
      gap: 16px;
      :nth-last-child(1) {
        font-weight: 700;
      }
    }
  }
  button,
  h1 {
    align-self: center;
    min-width: 320px;
  }
}
</style>
