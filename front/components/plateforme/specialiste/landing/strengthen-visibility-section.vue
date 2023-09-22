<template>
  <div class="strengthen-visibility-section">
    <split-view-landing-section
      reverse
      long-img
      image="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/JPEG/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+exterieur.jpeg"
      :point-list="pointList"
      button-value="Créer un compte"
      button-link="/authentification/creer-un-compte"
      :vmc-header-value="headerValue"
    >
      <div class="strengthen-visibility-section__wrapper-slot">
        <div class="strengthen-visibility-section__wrapper-slot--title-sec">INSCRIPTION 100% GRATUITE</div>
        <!-- <ul class="strengthen-visibility-section__wrapper-slot--list">
          <li>Créez votre compte et votre page profil gratuitement</li>
          <li>Répondez aux demandes de missions gratuitement</li>
          <li>Commission prélevée uniquement sur les mission réalisées</li>
        </ul> -->
      </div>
      <!-- <div class="strengthen-visibility-section__wrapper-slot">
        <div class="strengthen-visibility-section__wrapper-slot--title-sec">CHOISISSEZ VOS MISSIONS</div>
        <ul class="strengthen-visibility-section__wrapper-slot--list">
          <li>Recevez des demandes de missions pour les compétences que vous avez renseignées</li>
          <li>Choisissez les missions pour lesquelles vous souhaitez proposer un devis</li>
          <li>Modifiez à tous moment le type de missions que vous souhaitez recevoir</li>
        </ul>
      </div> -->
    </split-view-landing-section>

    <!-- <div class="float-section">
      <div class="float-section__card-stamp-stregthen-top">
        <div class="float-section__card-stamp-stregthen-top--header">
          <div class="user">
            <img src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg" alt="" />
            <div class="user-info">
              <span>MÉCANICIEN</span>
              <span>Bayard ARCOUET</span>
            </div>
          </div>
          <div class="skeleton-average">
            <div class="skeleton-average-wrapper">
              <div class="skeleton top"></div>
              <div class="skeleton middle"></div>
              <div class="skeleton bottom"></div>
            </div>
            <div class="stars">
              <fa :icon="['fas', 'star']" width="10px" />
              <fa :icon="['fas', 'star']" width="10px" />
              <fa :icon="['fas', 'star']" width="10px" />
              <fa :icon="['fas', 'star']" width="10px" />
              <fa :icon="['far', 'star']" width="10px" />
            </div>
          </div>
        </div>
        <div class="float-section__card-stamp-stregthen-top--middle-section">
          <div>
            <span>TARIFS</span>
          </div>
          <div>
            <span>DISPONIBILITÉS</span>
          </div>
        </div>
        <div class="float-section__card-stamp-stregthen-top--skills">
          <span>COMPÉTENCES</span>
          <div class="skeleton-content">
            <div class="skeleton"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <card-stamp-pro nav>
        <div class="float-section__card-stamp-stregthen-bottom">
          <div class="title">VOTRE ACTIVITÉ</div>
          <div class="content">
            <card-stamp-item
              title="CHRYSLER"
              text="Detailing"
              img="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg"
            />
            <hr class="is-hide" />
            <card-stamp-item
              title="CHRYSLER"
              text="Detailing"
              img="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg"
            />
            <hr class="is-hide" />
            <card-stamp-item
              class="is-hide"
              title="CHRYSLER"
              text="Detailing"
              img="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/testimonials/prestataire/4.jpg"
            />
          </div>
        </div>
      </card-stamp-pro>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const pointList = [
  { icon: ['fas', 'bolt'], describe: 'Compétences' },
  { icon: ['fas', 'bolt'], describe: 'Expériences' },
  { icon: ['fas', 'bolt'], describe: 'Exemples de missions réalisées' }
]

const headerValue = {
  text: 'RENFORCEZ VOTRE VISIBILITÉ',
  subtext: 'Une page de présentation de votre activité et de vos compétences'
}
</script>

<style scoped lang="scss">
.strengthen-visibility-section {
  position: relative;
  &__wrapper-slot {
    font-family: 'Nunito';
    &--title-sec {
      margin-bottom: 25px;
      font-weight: 700;
      font-size: 18px;
    }
    &--list {
      li {
        margin: 0 0 25px 25px;
      }
    }
  }
  .float-section {
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-45%, -50%);

    display: flex;
    flex-direction: column;
    gap: 50px;
    font-family: 'Montserrat';
    &__card-stamp-stregthen-top {
      display: flex;
      flex-direction: column;
      border: solid 0.5px;
      font-family: 'Mointserrat';
      box-shadow: 2px 2px 10px #000000a2;

      &--header {
        padding: 30px 30px 10px 30px;
        background-color: $color-dark-blue;
        .user {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          img {
            width: 75px;
            height: 75px;
            object-fit: cover;
          }
          .user-info {
            display: flex;
            flex-direction: column;
            color: $color-neon-blue;
            :first-child {
              font-size: 18px;
              font-weight: 800;
              margin-bottom: 5px;
            }
          }
        }
        .skeleton-average {
          display: flex;
          width: auto;
          .skeleton-average-wrapper {
            width: 50%;
            .skeleton {
              height: 10px;
              background-color: #dadada;
              margin-bottom: 5px;
              &.top {
                width: 100%;
              }
              &.middle {
                width: 40%;
              }
              &.bottom {
                width: 60%;
              }
            }
          }
          .stars {
            margin-left: 10px;
            margin-top: -5px;
            & > * {
              color: $color-neon-blue;
            }
          }
        }
      }
      &--middle-section {
        display: flex;
        justify-content: space-around;
        width: 100%;
        font-family: 'Montserrat';
        font-weight: 900;
        border-bottom: solid 0.5px;
        & > * {
          background-color: $color-neon-blue;
          width: 100%;
          padding: 15px 0;
          text-align: center;
          span {
            font-weight: 800;
          }
        }
        :nth-child(2) {
          background-color: #fff;
          border-left: solid 0.5px;
        }
      }
      &--skills {
        padding: 10px 30px;
        background-color: #fff;
        span {
          font-weight: 800;
        }
        .skeleton-content {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(3, 1fr);
          width: 100%;
          & > * {
            height: 10px;
            background-color: #dadada;
            margin: 5px 5px 0 0;
          }
          :nth-child(1) {
            grid-row: 1;
            grid-column: 1/4;
          }
          :nth-child(2) {
            grid-row: 1;
            grid-column: 4/7;
          }
          :nth-child(3) {
            grid-row: 1;
            grid-column: 7;
          }
          :nth-child(4) {
            grid-row: 2;
            grid-column: 1/3;
          }
          :nth-child(5) {
            grid-row: 2;
            grid-column: 3/6;
          }
          :nth-child(6) {
            grid-row: 2;
            grid-column: 6/8;
          }
          :nth-child(7) {
            grid-row: 3;
            grid-column: 1/2;
          }
          :nth-child(8) {
            grid-row: 3;
            grid-column: 2/5;
          }
          :nth-child(9) {
            grid-row: 3;
            grid-column: 5/8;
          }
        }
      }
    }
    &__card-stamp-stregthen-bottom {
      display: flex;
      flex-direction: column;
      width: 240px;
      font-family: 'Montserrat';
      background-color: #fff;
      .title {
        text-align: left;
        font-weight: 700;
        margin-bottom: 15px;
      }
      .content {
        hr {
          border: none;
          border-top: solid 0.5px;
          margin-top: 7px;
        }
      }
    }
  }
}

@media screen and (min-width: 1950px) {
  .strengthen-visibility-section {
    .float-section {
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@media screen and (max-width: 640px) {
  .strengthen-visibility-section {
    .float-section {
      top: 35%;
      left: 45%;
      &__card-stamp-stregthen-bottom {
        .content {
          .is-hide {
            display: none;
          }
        }
      }
    }
  }
}
</style>
