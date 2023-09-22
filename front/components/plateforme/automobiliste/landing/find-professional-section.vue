<template>
  <section class="find-professional-section">
    <split-view-landing-section
      :image="splitViewValues.image"
      :point-list="splitViewValues.pointList"
      :button-value="splitViewValues.buttonValue.value"
      :button-link="splitViewValues.buttonValue.link"
      :vmc-header-value="headerValue"
      reverse
    />
    <!-- FLOAT SECTION -->
    <!-- <div class="find-professional-section__float-section">
      <div class="find-professional-section__float-section--sim-input">
        <fa :icon="['fas', 'magnifying-glass']" />
        <span>Changement des plaquettes de frein</span>
      </div>
      <card-stamp
        class="find-professional-section__float-section--card-stamp-top"
        :user-pic="cardTop.pic"
        :title="cardTop.title"
        :subtitle="cardTop.subtitle"
        :describe="cardTop.describe"
        :describe-more="cardTop.more"
        stars
      />
      <card-stamp
        class="find-professional-section__float-section--card-stamp-bottom"
        :user-pic="cardBottom.pic"
        :title="cardBottom.title"
        :subtitle="cardBottom.subtitle"
        :describe="cardBottom.describe"
        :describe-more="cardBottom.more"
        stars
      />
    </div> -->
  </section>
</template>

<script setup lang="ts">
const splitViewValues = {
  image:
    'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg',
  pointList: [
    { icon: ['fas', 'bolt'], describe: 'Problème rencontré' },
    { icon: ['fas', 'bolt'], describe: 'Véhicule' },
    { icon: ['fas', 'bolt'], describe: 'Adresse' }
  ],
  buttonValue: {
    value: 'trouvez un spécialiste',
    link: '/plateforme/automobiliste/nouvelle-demande'
  }
}

const headerValue = {
  text: 'TROUVEZ UN BON SPÉCIALISTE RAPIDEMENT',
  subtext: 'Créez une demande de devis en quelques clics'
}

// const cardTop = {
//   title: 'Samuel',
//   subtitle: 'Mécanicien',
//   pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg',
//   describe: '250€/J',
//   more: 'à temps plein'
// }

// const cardBottom = {
//   title: 'Andrew',
//   subtitle: 'Detailer',
//   pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/1.jpg',
//   describe: '210€/J',
//   more: 'à temps plein'
// }
</script>

<style lang="scss" scoped>
.find-professional-section {
  position: relative;
  &__float-section {
    position: absolute;
    top: 54%;
    left: 50%;
    transform: translate(-50%, -50%);
    & > * {
      margin-bottom: 20px;
      box-shadow: 2px 2px 10px #000000a2;
      cursor: default;
    }
    &--sim-input {
      display: flex;
      align-items: center;
      width: 320px;
      margin-left: 175px;
      padding: 7px;
      background-color: #fff;
      border: solid 0.5px;
      span {
        margin-left: 7px;
      }
    }
    &--card-stamp-top {
      margin-left: 225px;
    }
    &--card-stamp-bottom {
      margin-left: 300px;
      z-index: 9;
    }
  }
}

@media screen and (max-width: 750px) {
  .find-professional-section {
    &__float-section {
      top: 60%;
      left: 50%;
      width: fit-content;
      margin: auto;
      & > * {
        margin: 20px auto;
      }
      &--sim-input {
        margin-left: 20px;
        width: 280px;
      }
      &--card-stamp-top {
        margin-bottom: -30px;
      }
      &--card-stamp-bottom {
        margin-left: 45px;
      }
    }
  }
}

@media screen and (max-width: 359px) {
  .find-professional-section {
    &__float-section {
      &--sim-input {
        width: 250px;
      }
      &--card-stamp-bottom {
        margin-left: 30px;
      }
    }
  }
}
</style>
