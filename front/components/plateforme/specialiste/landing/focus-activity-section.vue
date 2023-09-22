<template>
  <div class="focus-activity-section">
    <split-view-landing-section
      image="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg"
      :point-list="pointList"
      button-value="Créer un compte"
      button-link="/authentification/creer-un-compte"
      :vmc-header-value="headerValue"
    />

    <!-- <div class="float-section">
      <card-stamp-pro nav>
        <div class="float-section__header">
          <img src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/american-cars.jpeg" alt="" class="float-section__header--img" />
          <div class="float-section__header--text">
            <span>OUTIL DE DEVIS</span>
            <span>Réalisation Detailing sur Porsche 911</span>
          </div>
        </div>
        <div class="float-section__main">
          <div class="float-section__main--title">MAIN D'OEUVRE</div>
          <div class="float-section__main--skeletons-container">
            <div class="skeletons-wrapper">
              <div class="skeleton"></div>
              <div class="skeleton"></div>
            </div>
            <div class="skeletons-wrapper">
              <div class="skeleton"></div>
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="float-section__main--title">PIECES ET PRODUITS</div>
          <div class="float-section__main--skeletons-container">
            <div class="skeletons-wrapper">
              <div class="skeleton"></div>
              <div class="skeleton"></div>
            </div>
            <div class="skeletons-wrapper">
              <div class="skeleton"></div>
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="float-section__main--total-container">
            <span>Total</span>
            <div class="skeleton"></div>
          </div>
        </div>
        <div class="float-section__fake-link">Envoyer un message</div>
      </card-stamp-pro>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const pointList = [
  { icon: ['fas', 'bolt'], describe: 'Outil de devis en ligne' },
  { icon: ['fas', 'bolt'], describe: 'Factures établies automatiquement' },
  { icon: ['fas', 'bolt'], describe: 'Gestion de votre planning' }
]

const headerValue = {
  text: 'GAGNEZ DU TEMPS ET CONCENTREZ VOUS SUR VOTRE ACTIVITÉ',
  subtext: 'Nos outils en ligne vous permettent de réduire vos tâches administratives'
}
</script>

<style scoped lang="scss">
.focus-activity-section {
  position: relative;
  .float-section {
    position: absolute;
    top: 50%;
    left: 45%;
    transform: translate(-55%, -50%);
    font-family: 'Montserrat';
    &__header {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      &--img {
        width: 75px;
        height: 75px;
        object-fit: cover;
      }
      &--text {
        display: flex;
        flex-direction: column;
        text-align: left;
        width: fit-content;
        :first-child {
          font-size: 16px;
          font-weight: 700;
        }
        :nth-child(2) {
          width: 100%;
          white-space: pre-wrap;
          margin-top: 10px;
        }
      }
    }
    &__main {
      display: flex;
      flex-direction: column;
      text-align: left;
      gap: 15px;
      &--title {
        font-size: 10px;
        font-weight: 600;
      }
      &--skeletons-container {
        .skeletons-wrapper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .skeleton {
            height: 12px;
            background-color: #dadada;
          }
          :nth-child(1) {
            width: 70%;
          }
          :nth-child(2) {
            width: 25%;
          }
        }
      }
      &--total-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        margin-bottom: 15px;
        span {
          display: block;
          margin-right: 10px;
        }

        .skeleton {
          height: 12px;
          width: 35%;
          background-color: #dadada;
        }
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

@media screen and (min-width: 2200px) {
  .focus-activity-section {
    .float-section {
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@media screen and (max-width: 1220px) {
  .focus-activity-section {
    .float-section {
      left: 41%;
      transform: translate(-59%, -50%);
    }
  }
}

@media screen and (max-width: 865px) {
  .focus-activity-section {
    .float-section {
      left: 38%;
      transform: translate(-62%, -50%);
    }
  }
}

@media screen and (max-width: 640px) {
  .focus-activity-section {
    .float-section {
      top: 53%;
      left: 50%;
      transform: translate(-50%, -47%);
    }
  }
}

@media screen and (max-width: 450px) {
  .focus-activity-section {
    .float-section {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
