<template>
  <section class="service-book-section">
    <split-view-landing-section
      :image="splitViewValues.image"
      :point-list="splitViewValues.pointList"
      :button-value="splitViewValues.buttonValue.value"
      :button-link="splitViewValues.buttonValue.link"
      :vmc-header-value="headerValue"
    />
    <!-- FLOAT SECTION -->
    <!-- <div class="float-section">
      <div class="float-section__card-center">
        <div class="float-section__card-center--title">CARNET D'ENTRETIENT</div>
        <div class="float-section__card-center--pic-car">
          <img src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/american-cars.jpeg" alt="" />
          <span>PEUGEOT 206</span>
        </div>
        <div class="float-section__card-center--bloc">
          <span>Detailing</span><span>Mars</span>
          <div class="skeleton-text top"></div>
          <div class="skeleton-text center"></div>
          <div class="skeleton-text bottom"></div>
          <hr />
        </div>
        <div class="float-section__card-center--bloc">
          <span>Vidange</span><span>Décembre</span>
          <div class="skeleton-text top"></div>
          <div class="skeleton-text center"></div>
          <div class="skeleton-text bottom"></div>
          <hr />
        </div>
        <div class="float-section__card-center--bloc">
          <span>Remplacement plaquettes</span><span>Octobre</span>
          <div class="skeleton-text top"></div>
          <div class="skeleton-text center"></div>
          <div class="skeleton-text bottom"></div>
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
    { icon: ['fas', 'bolt'], describe: "Accédez à l'ensemble des factures des missions réalisées via la plateforme" },
    { icon: ['fas', 'bolt'], describe: "Ajoutez les factures d'entretien réalisées en dehors de la plateforme" },
    { icon: ['fas', 'bolt'], describe: 'Suivez les entretiens réalisés et anticipez les entretiens à prévoir' }
  ],
  buttonValue: {
    value: 'trouvez un spécialiste',
    link: '/plateforme/automobiliste/nouvelle-demande'
  }
}

const headerValue = {
  text: "ACCÉDEZ A NOTRE OUTIL DE CARNET D'ENTRETIEN DIGITALISÉ",
  subtext: "Suivez à tout moment l'historique d`'entretien de votre véhicule"
}
</script>

<style scoped lang="scss">
.service-book-section {
  $--main-color: $color-light-grey;

  position: relative;
  .float-section {
    position: absolute;
    top: 57%;
    left: 47%;
    transform: translate(-57%, -43%);
    &__card-center {
      display: flex;
      flex-direction: column;
      gap: 7px;
      width: 300px;
      padding: 20px;
      background-color: $white;
      border: solid 0.5px $--main-color;
      box-shadow: 2px 2px 10px $shadow-landing-dark;
      &--title {
        width: auto;
        text-align: center;
        margin-bottom: 5px;
        font-family: 'Montserrat';
        font-style: italic;
        font-weight: 700;
      }
      &--pic-car {
        display: flex;
        gap: 15px;
        width: 100%;
        img {
          width: 60px;
          height: 60px;
          object-fit: cover;
        }
        span {
          font-family: 'Montserrat';
          font-weight: 700;
          font-size: 12px;
        }
      }
      &--bloc {
        :nth-child(2) {
          display: block;
          text-align: right;
        }
        .skeleton-text {
          height: 12px;
          background-color: $--main-color;
          margin-bottom: 7px;
          &.top {
            width: 60%;
          }
          &.center {
            width: 90%;
          }
          &.bottom {
            width: 75%;
          }
        }
        hr {
          border: none;
          border-top: solid 0.5px;
          margin-top: 7px;
        }
      }
    }
  }
}

@media screen and (min-width: 2000px) {
  .service-book-section {
    .float-section {
      left: 50%;
    }
  }
}

@media screen and (max-width: 1400px) {
  .service-book-section {
    .float-section {
      left: 43%;
      transform: translate(-60%, -43%);
    }
  }
}

@media screen and (max-width: 930px) {
  .service-book-section {
    .float-section {
      top: 55%;
      left: 40%;
      transform: translate(-63%, -45%);
    }
  }
}

@media screen and (max-width: 750px) {
  .service-book-section {
    .float-section {
      top: 37%;
      left: 50%;
      transform: translate(-50%, -30%);
    }
  }
}

@media screen and (max-width: 750px) and (max-height: 740px) {
  .service-book-section {
    .float-section {
      top: 42%;
      &__card-center {
        &--bloc {
          .skeleton-text {
            height: 5px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 400px) {
  .service-book-section {
    .float-section {
      top: 40%;
    }
  }
}

@media screen and (max-width: 370px) and (max-height: 400px) {
  .service-book-section {
    .float-section {
      top: 46%;
      &__card-center {
        width: calc(100vw - 100px);
        padding: 10px;
        &--title {
          font-size: 12px;
        }
        &--pic-car {
          img {
            width: 35px;
            height: 35px;
          }
          span {
            font-size: 10px;
          }
        }
        &--bloc {
          .skeleton-text {
            height: 5px;
          }
          hr {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
