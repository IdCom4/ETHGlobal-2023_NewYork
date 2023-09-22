<template>
  <footer :class="[footerBackgroundColor]">
    <div :class="footerBackgroundColor === 'background-white' ? 'dark' : 'white'" class="content">
      <div class="top">
        <div class="vmc-logo"></div>
        <div class="network">
          <a href="https://www.facebook.com/Valuemycar.centre/" class="logo FB" title="Suivez-nous sur Facebook">
            <fa icon="fa-brands fa-square-facebook" />
          </a>
          <a href="https://www.instagram.com/valuemycar.rambouillet/?hl=fr" class="logo IG" title="Suivez-nous sur Instagram">
            <fa icon="fa-brands fa-instagram" />
          </a>
          <a href="https://www.linkedin.com/company/valuemycar-fr/" class="logo LK" title="Suivez-nous sur LinkedIn">
            <fa icon="fa-brands fa-linkedin" />
          </a>
          <a href="https://twitter.com/valuemycar_fr?lang=fr" class="logo TW" title="Suivez-nous sur Twitter">
            <fa icon="fa-brands fa-square-twitter" />
          </a>
          <a href="https://www.tiktok.com/@valuemycar.rambouillet" class="logo TK" title="Suivez-nous sur Tik-Tok">
            <fa icon="fa-brands fa-tiktok" />
          </a>
          <!-- <a href="" class="logo" title="Patager">
            <fa icon="fa-solid fa-share-nodes" />
          </a>href -->
        </div>
      </div>
      <div class="container">
        <div class="location">
          <div>
            <fa icon="fa-solid fa-location-dot" class="icon" />
            <p>3 Rue Hélène Boucher, 78125 Gazeran</p>
          </div>
          <div>
            <fa icon="fa-regular fa-clock" class="icon" />
            <p>Horaires d'ouverture:<br />Du Lundi au Dimanche<br />de 9h30 à 18h30</p>
          </div>
          <div>
            <fa icon="fa-solid fa-phone" class="icon" />
            <p>01 61 39 16 64</p>
          </div>
        </div>
        <div class="about">
          <p>A propos</p>
          <ul>
            <li><nuxt-link to="/centres/reservation/WASHBOX" title="Réservez un box">Réserver un boxe</nuxt-link></li>
            <li><nuxt-link to="/centres/boxes/box-mecanique" title="visitez nos boxes mécanique">Boxe mécanique</nuxt-link></li>
            <li><nuxt-link to="/centres/boxes/box-detailing" title="visitez nos boxes d'esthétique">Boxe esthétique</nuxt-link></li>
            <li><nuxt-link to="/centres/boxes/box-lavage" title="visitez nos boxes de lavage">Boxe lavage</nuxt-link></li>
            <li><nuxt-link to="/centres/services" title="visitez nos services">Nos services</nuxt-link></li>
            <!-- <li><nuxt-link to="">nos partenaires</nuxt-link></li> -->
            <!-- <li><nuxt-link to="">les avis</nuxt-link></li> -->
          </ul>
        </div>
        <p>
          ValueMyCar vous propose la location de Boxes équipés destinés à l'entretien mécanique et esthétique de votre véhicule.
          <br />
          Nous avons trois types de boxe / Station de lavage - Box Mécanique - Box Détailing
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

enum ColorVersions {
  WHITE = 'white',
  BLUE = 'blue'
}
const footerBackgroundColor = ref<string>('background-blue')
useGlobalEvents().subscribeTo<ColorVersions>(
  GlobalEventTypes.UPDATE_FOOTER_THEME,
  (payload?: ColorVersions) => !!(footerBackgroundColor.value = `background-${payload || ColorVersions.BLUE}`)
)
</script>

<style lang="scss">
footer {
  height: 80vh;
  &.background-white {
    background-color: #fff;
    .content {
      color: #000;
    }
  }
  &.background-blue {
    background-color: $color-dark-blue;
  }
  .content {
    width: auto;
    max-width: 1220px;
    height: 100%;
    padding: 150px 20px 0 20px;
    margin: auto;
    .top,
    .container {
      display: flex;
      justify-content: space-between;
      margin: 35px 20px 0 20px;
    }
    .top {
      .vmc-logo {
        width: 150px;
        padding: 20px;
        background: left / contain no-repeat;
        background-image: url('https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/02_ValueMyCar_LogotypeNegatif_RVB.png');
      }
      .network {
        a {
          margin-left: 2vw;
          color: #fff;
          cursor: pointer;
          transition: 0.3s;
          &.logo {
            &:hover {
              transform: scale(1.1);
            }
          }
          &.YT {
            &:hover {
              color: #ff0000;
              filter: drop-shadow(0 0 2px #000);
            }
          }
          &.FB {
            border: solid transparent;
            &:hover {
              filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.18));
              color: #3b5998;
              border-radius: 5px;
              transform: scale(1);
            }
          }
          &.TK {
            &:hover {
              color: #fff;
              filter: drop-shadow(2.5px 2.5px 0 #ee1d52) drop-shadow(-2.5px -2.5px 0 #69c9d0);
            }
          }
          &.LK {
            &:hover {
              color: #0e76a8;
            }
          }
          &.TW {
            &:hover {
              color: #00acee;
            }
          }
          &.IG {
            &:hover {
              color: #dd2a7b;
              filter: drop-shadow(-2px -2px 1px #8134af);
            }
          }
          &.share {
            &:hover {
              color: rgba(255, 255, 255, 0.169);
              transform: rotate(360deg);
              // filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.502));
            }
          }
        }
      }
    }
    .container {
      color: #fff;

      .location,
      .about,
      p {
        width: 100%;
        color: #fff;
      }
      .icon {
        color: #fff;
        margin-right: 5px;
      }
      .location {
        & > * {
          display: flex;
          align-items: center;
          margin: 20px 0;
          p {
            font-family: 'Nunito';
            font-size: 16px;
            width: 100%;
            margin-left: 5px;
          }
        }
      }
      .about {
        p {
          margin-bottom: 13px;
        }
        p,
        ul {
          font-family: 'Montserrat';
          font-size: 16px;
          font-weight: 500;
        }
        ul {
          li {
            margin: 10px 0;
            font-weight: 300;
            a {
              color: #fff;
              text-decoration: underline transparent;
              transition: 0.3s;
              &:hover {
                text-decoration: underline #fff;
              }
            }
          }
        }
      }
      p {
        font-family: 'Nunito';
        font-size: 16px;
        line-height: 20px;
      }
    }

    // DARK THEME
    &.dark {
      .top {
        .vmc-logo {
          background-image: url('https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/01_ValueMyCar_LogotypePositif_RVB.png');
        }
        .network {
          a {
            color: #000;
          }
        }
      }
      .container {
        .location {
          p {
            color: #000;
          }
        }
        .about {
          p {
            color: #000;
          }
          ul {
            li {
              a {
                color: #000;
                &:hover {
                  text-decoration: underline #000;
                }
              }
            }
          }
        }
        p {
          color: #000;
        }
      }
    }
  }
}

@media screen and (max-width: 740px) {
  footer {
    height: 97vh;
    margin: auto;
    .content {
      padding-top: 7px;
      width: 90%;
      .top {
        flex-direction: column;
        & > * {
          margin: 0 0 10px 0;
        }
      }
      .container {
        flex-direction: column-reverse;
        & > * {
          margin-bottom: 25px;
        }
        .location {
          & > * {
            max-height: 25px;
            p {
              font-size: 12px;
              margin: 0 0 0 10px;
            }
          }
        }
        .about {
          p,
          ul > li {
            font-size: 12px;
          }
        }
        p {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
