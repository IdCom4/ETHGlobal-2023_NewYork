<template>
  <section class="compare-quote-section">
    <split-view-landing-section
      :image="splitViewValues.image"
      :point-list="splitViewValues.pointList"
      :button-value="splitViewValues.buttonValue.value"
      :button-link="splitViewValues.buttonValue.link"
      :vmc-header-value="headerValue"
    />
    <!-- FLOAT SECTION -->
    <!-- <div class="compare-quote-section__float-section">
      <quote-stamp
        :user-pic="quoteStampValues.left.pic"
        :card-number="quoteStampValues.left.number"
        :text-quote="quoteStampValues.text"
        class="compare-quote-section__float-section--left"
      />
      <quote-stamp
        :user-pic="quoteStampValues.center.pic"
        :card-number="quoteStampValues.center.number"
        :text-quote="quoteStampValues.text"
        class="compare-quote-section__float-section--center"
      />
      <quote-stamp
        :user-pic="quoteStampValues.right.pic"
        :card-number="quoteStampValues.right.number"
        :text-quote="quoteStampValues.text"
        class="compare-quote-section__float-section--right"
      />
    </div> -->
  </section>
</template>

<script setup lang="ts">
const splitViewValues = {
  image:
    'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/WEBP/Detailing+-+Mazda+MX5+NA+bleue+-+21.webp',
  pointList: [
    { icon: ['fas', 'bolt'], describe: 'Fiche de présentation détailée du spécialiste' },
    { icon: ['fas', 'bolt'], describe: 'Devis détaillé' },
    { icon: ['fas', 'bolt'], describe: 'Avis laissés par les anciens clients' }
  ],
  buttonValue: {
    value: 'trouvez un spécialiste',
    link: '/plateforme/automobiliste/nouvelle-demande'
  }
}

const headerValue = {
  text: 'RECEVEZ ET COMPAREZ DES PROPOSITIONS DE DEVIS',
  subtext: 'Choisissez le spécialiste à qui confier votre véhicule'
}

// const quoteStampValues = {
//   text: 'Changement des plaquettes de frein',
//   left: {
//     pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/3.jpg',
//     number: 3
//   },
//   center: {
//     pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg',
//     number: 2
//   },
//   right: {
//     pic: 'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/1.jpg',
//     number: 1
//   }
// }
</script>

<style lang="scss" scoped>
.compare-quote-section {
  position: relative;

  &__float-section {
    position: absolute;
    top: 45%;
    left: 47%;
    transform: translate(-63%, -50%);
    width: 309px;
    height: 405px;
    & > * {
      box-shadow: 2px 2px 10px $shadow-landing-dark;
      cursor: default;
    }
    &--left {
      transform: translate(-170%, 100%);
      height: 228px;
      width: 174px;
      padding: 17px;
      gap: 19px;
      font-size: 10px;
    }
    &--center {
      z-index: 1;
      transform: translate(-70%, -15%);
      height: 309px;
      width: 236px;
      padding: 23px;
      gap: 25px;
      font-size: 14px;
    }
    &--right {
      z-index: 2;
      transform: translate(0%, -100%);
      height: 405px;
      width: 309px;
      padding: 30px;
      gap: 33px;
      font-size: 19px;
    }
  }
}

@media screen and (min-width: 2400px) {
  .compare-quote-section {
    &__float-section {
      left: 52%;
    }
  }
}

@media screen and (max-width: 1360px) {
  .compare-quote-section {
    &__float-section {
      width: 309 * 0.6px;
      height: 405 * 0.6px;
      left: 46%;
      transform: translate(-64%, -50%);
      &--left {
        height: 228 * 0.6px;
        width: 174 * 0.6px;
        padding: 17 * 0.6px;
        gap: 19 * 0.6px;
        font-size: 10 * 0.6px;
      }
      &--center {
        height: 309 * 0.6px;
        width: 236 * 0.6px;
        padding: 23 * 0.6px;
        gap: 25 * 0.6px;
        font-size: 14 * 0.6px;
      }
      &--right {
        height: 405 * 0.6px;
        width: 309 * 0.6px;
        padding: 30 * 0.6px;
        gap: 33 * 0.6px;
        font-size: 19 * 0.6px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .compare-quote-section {
    &__float-section {
      top: 47%;
      left: 62%;
    }
  }
}

@media screen and (max-width: 505px) {
  .compare-quote-section {
    &__float-section {
      top: 60%;
      left: 70%;
      transform: translate(-35%, -40%);
      &--left {
        height: 228 * 0.4px;
        width: 174 * 0.4px;
        padding: 17 * 0.4px;
        gap: 19 * 0.4px;
        font-size: 10 * 0.4px;
      }
      &--center {
        height: 309 * 0.4px;
        width: 236 * 0.4px;
        padding: 23 * 0.4px;
        gap: 25 * 0.4px;
        font-size: 14 * 0.4px;
      }
      &--right {
        height: 405 * 0.4px;
        width: 309 * 0.4px;
        padding: 30 * 0.4px;
        gap: 33 * 0.4px;
        font-size: 19 * 0.4px;
      }
    }
  }
}
</style>
