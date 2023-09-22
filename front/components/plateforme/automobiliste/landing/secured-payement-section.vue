<template>
  <section class="secured-payement-section">
    <split-view-landing-section
      :image="splitViewValues.image"
      :point-list="splitViewValues.pointList"
      :button-value="splitViewValues.buttonValue.value"
      :button-link="splitViewValues.buttonValue.link"
      :vmc-header-value="headerValue"
      reverse
    >
    </split-view-landing-section>
    <!-- FLOAT SECTION -->
    <!-- <div class="float-section">
      <div class="float-section__card-center">
        <div class="square-skeleton"></div>
        <div class="text">PAYEMENT SÉCURISÉ</div>
        <div class="text-skeleton">
          <div class="text-skeleton__wrapper">
            <span class="text-skeleton__wrapper--mask"></span>
            <span class="text-skeleton__wrapper--mask"></span>
            <span class="text-skeleton__wrapper--mask"></span>
          </div>
          <div class="text-skeleton__wrapper--mask long"></div>
        </div>
        <div class="rounds-skeleton">
          <div class="rounds-skeleton__round"></div>
          <div class="rounds-skeleton__round"></div>
        </div>
      </div>
    </div> -->
  </section>
</template>

<script setup lang="ts">
const splitViewValues = {
  image:
    'https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg',
  pointList: [
    { icon: ['fas', 'bolt'], describe: 'Validez votre devis avant le début de la mission' },
    { icon: ['fas', 'bolt'], describe: 'Aucune modification de devis possible sans votre accord' },
    { icon: ['fas', 'bolt'], describe: "Le paiement au spécialiste n'intervient qu'une fois la mission finalisée" }
  ],
  buttonValue: {
    value: 'trouvez un spécialiste',
    link: '/plateforme/automobiliste/nouvelle-demande'
  }
}

const headerValue = {
  text: 'PRIX GARANTI ET PAIEMENT SECURISÉ',
  subtext: 'Pas de mauvaise surprise sur le prix à payer'
}
</script>

<style scoped lang="scss">
.secured-payement-section {
  $--main-color: $color-light-grey;

  position: relative;
  .float-section {
    position: absolute;
    top: 50%;
    left: 58%;
    transform: translate(-40%, -50%);
    &__card-center {
      display: grid;
      grid-template-columns: 100px 1fr;
      grid-template-rows: 60px auto;
      width: 350px;
      height: auto;
      padding: 15px;
      background-color: $white;
      border: solid 0.5px $--main-color;
      box-shadow: 2px 2px 10px $shadow-landing-dark;
      .square-skeleton {
        grid-row: 1/3;
        grid-column: 1;
        width: 100px;
        height: 60px;
        border-radius: 15px;
        background-color: $--main-color;
      }
      .text {
        grid-row: 1;
        grid-column: 2;
        width: 100%;
        text-align: right;
        font-family: 'Montserrat';
        font-style: italic;
        font-weight: 700;
        font-size: 15px;
      }
      .text-skeleton {
        grid-column: 1;
        grid-row: 2;
        width: 150%;
        &__wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          margin-top: 25px;
          &--mask {
            height: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: $--main-color;
          }
        }
      }
      .rounds-skeleton {
        grid-column: 2;
        grid-row: 2;
        display: flex;
        justify-content: right;
        align-items: center;
        &__round {
          width: 50px;
          height: 50px;
          border-radius: 50px;
          background-color: $--main-color;
        }
        :first-child {
          margin-right: -15px;
          outline: solid 5px $white;
          z-index: 5;
        }
      }
    }
  }
}

@media screen and (min-width: 1750px) {
  .secured-payement-section {
    .float-section {
      left: 50%;
    }
  }
}

@media screen and (max-width: 750px) {
  .secured-payement-section {
    .float-section {
      top: 58%;
      left: 50%;
      transform: translate(-50%, -40%);
    }
  }
}

@media screen and (max-width: 400px) {
  .secured-payement-section {
    .float-section {
      &__card-center {
        width: calc(100vw - 30px);
      }
    }
  }
}
</style>
