<template>
  <tracking-section class="box-confirmation">
    <h4>La réservation de votre Box {{ boxText }} a bien été prise en compte</h4>
    <p class="largest">Vous allez bientôt recevoir un email de confirmation</p>
    <div class="thanks-sections">
      <h4>Merci pour votre confiance</h4>
      <h1></h1>
    </div>
    <NuxtLink to="/"><button class="btn_navigation --btn">Continuer la navigation</button></NuxtLink>
  </tracking-section>
</template>

<script lang="ts" setup>
import { GlobalEventTypes } from '@/types/constants'
useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'light')

const route = useRoute()
const currentBox = route.params.boxType
const boxTexts: Record<TBoxCategory, string> = {
  MECABOX: 'mécanique',
  WASHBOX: 'de lavage',
  DETAILINGBOX: 'detailing'
}

const boxText = boxTexts[String(currentBox).toUpperCase() as TBoxCategory]
</script>

<style scoped lang="scss">
.box-confirmation {
  > p {
    margin: 15px 0px;
  }

  > h4 {
    margin: 10px 0px;
  }
}

h4 {
  text-align: center;
  font-weight: 700;
}

.thanks-sections {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 40px 0px;
}

.--btn {
  padding: 10px;
}

@media screen and (max-width: 600px) {
  .box-confirmation {
    padding: 50px 20px;
  }
}
</style>
