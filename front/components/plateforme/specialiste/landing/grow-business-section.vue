<template>
  <div class="grow-business-section">
    <split-view-landing-section
      reverse
      image="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg"
      :point-list="pointList"
      button-value="Créer un compte"
      button-link="/authentification/creer-un-compte"
      :vmc-header-value="headerValue"
    />

    <!-- <div class="float-section">
      <card-stamp-pro nav>
        <div class="float-section__title">NOUVELLE MISSION !</div>
        <div class="float-section__subtitle">Réalisation Detailing sur Porsche 911</div>
        <img class="float-section__img" src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/american-cars.jpeg" />
        <div class="float-section__tags">
          <span>MÉCANIQUE</span>
          <span>DETAILING</span>
          <span>MOTEUR</span>
          <span>VIDANGE</span>
        </div>
        <div class="float-section__fake-link">Envoyer un message</div>
      </card-stamp-pro>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const pointList = [
  { icon: ['fas', 'bolt'], describe: 'Choisissez vos missions et fixez librement vos tarifs' },
  { icon: ['fas', 'bolt'], describe: "Réduisez vos taches adminstratives et concentrez vous sur l'essentiel" },
  { icon: ['fas', 'bolt'], describe: 'Recevez votre paiement dès la finalisation de la mission' }
]

const headerValue = {
  text: 'DÉVELOPPEZ VOTRE ACTIVITÉ',
  subtext: 'Recevez et choisissez des missions adaptées à vos compétences.'
}
</script>

<style scoped lang="scss">
.grow-business-section {
  position: relative;
  .float-section {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-45%, -50%);
    &__title {
      font-family: 'Montserrat';
      font-weight: 700;
      margin-bottom: 15px;
    }
    &__subtitle {
      width: 120px;
      margin: auto;
      font-family: 'Nunito';
      font-size: 12px;
      margin-bottom: 15px;
    }
    &__img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      margin-bottom: 15px;
    }
    &__tags {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 5px;
      width: 60%;
      margin: auto;
      margin-bottom: 15px;
      span {
        padding: 1px 3px;
        font-family: 'Montserrat';
        font-size: 10px;
        font-style: italic;
        border: solid 0.5px;
      }
    }
    &__fake-link {
      font-family: 'Montserrat';
      font-weight: 600;
      font-size: 10px;
      text-decoration: underline;
    }
  }
}

@media screen and (min-width: 2000px) {
  .grow-business-section {
    .float-section {
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@media screen and (max-width: 640px) {
  .grow-business-section {
    .float-section {
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
