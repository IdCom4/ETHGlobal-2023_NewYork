<template>
  <footer class="vmc-footer" :class="[footerBackgroundColor]">
    <div class="vmc-footer__wrapper">
      <div class="vmc-footer__wrapper--social-links">
        <nuxt-link to="/" title="Accueil">
          <div class="vmc-logo"></div>
        </nuxt-link>
        <div class="network">
          <a class="network__link YT" href="https://www.youtube.com/channel/UCBeYH8k2JSZJPicRdLo8xfQ" target="_blank" title="Suivez-nous sur Youtube">
            <fa icon="fa-brands fa-youtube" />
          </a>
          <a class="network__link FB" href="https://www.facebook.com/Valuemycar.centre/" target="_blank" title="Suivez-nous sur Facebook">
            <fa icon="fa-brands fa-square-facebook" />
          </a>
          <a
            class="network__link IG"
            href="https://www.instagram.com/valuemycar.rambouillet/?hl=fr"
            target="_blank"
            title="Suivez-nous sur Instagram"
          >
            <fa icon="fa-brands fa-instagram" />
          </a>
          <a class="network__link LK" href="https://www.linkedin.com/company/valuemycar-fr/" target="_blank" title="Suivez-nous sur LinkedIn">
            <fa icon="fa-brands fa-linkedin" />
          </a>
          <a class="network__link TW" href="https://twitter.com/valuemycar_fr?lang=fr" target="_blank" title="Suivez-nous sur Twitter">
            <fa icon="fa-brands fa-square-twitter" />
            <!-- <fa icon="fa-brands fa-x-twitter" /> -->
          </a>
          <a class="network__link TK" href="https://www.tiktok.com/@valuemycar.rambouillet" target="_blank" title="Suivez-nous sur Tik-Tok">
            <fa icon="fa-brands fa-tiktok" />
          </a>
          <!-- <a href="" class="logo" title="Patager">
            <fa icon="fa-solid fa-share-nodes" />
          </a>href -->
        </div>
      </div>
      <div class="vmc-footer__wrapper--content" :class="[footerBackgroundColor ? 'light-theme-content' : 'dark-theme-content']">
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
          <div class="about__wrapper">
            <ul class="about__wrapper--ul">
              <li>À propos du centre à Rambouillet</li>
              <li>
                <nuxt-link to="/centres/reservation" title="Réservez un box">Réserver un boxe</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/centres/services" title="visitez nos services">Nos services</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/centres/cgu-cgv" title="Condition générale de vente et d'utilisation">CGU/CGV</nuxt-link>
              </li>
              <!-- <li><nuxt-link to="">nos partenaires</nuxt-link></li> -->
              <!-- <li><nuxt-link to="">les avis</nuxt-link></li> -->
            </ul>
            <p class="about__wrapper--describe">
              Le centre ValueMyCar vous propose à Rambouillet la location d'espace pour l'entretien esthétique et mécanique de votre auto ou votre
              moto.
            </p>
          </div>
          <div class="about__wrapper">
            <ul class="about__wrapper--ul">
              <li>À propos de la Plateforme</li>
              <li>
                <nuxt-link to="/plateforme/automobiliste" title="Trouver des spécialiste partout en France"
                  >Trouver des spécialiste partout en France</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/plateforme/specialiste" title="Devenir spécialiste">Devenir spécialiste</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/plateforme/cgu-cgv" title="Condition générale de vente et d'utilisation">CGU/CGV</nuxt-link>
              </li>
              <!-- <li><nuxt-link to="">nos partenaires</nuxt-link></li> -->
              <!-- <li><nuxt-link to="">les avis</nuxt-link></li> -->
            </ul>
            <p class="about__wrapper--describe">
              La plateforme ValueMyCar permet la mise en relation entre automobilistes et spécialistes de l’automobile partout en France.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

enum ThemeVersions {
  LIGHT = 'light',
  DARK = 'dark'
}

const footerBackgroundColor = ref<string>('dark-theme')

/* UPDATE FOOTER */
useGlobalEvents().subscribeTo<ThemeVersions>(
  GlobalEventTypes.UPDATE_FOOTER_THEME,
  (payload?: ThemeVersions) => !!(footerBackgroundColor.value = `${payload || ThemeVersions.DARK}-theme`)
)
</script>

<style lang="scss">
.vmc-footer {
  padding-top: 15vh;
  &__wrapper {
    width: auto;
    max-width: 1220px;
    // height: 100%;
    padding: 0 20px 0 20px;
    margin: auto;
    & > * {
      display: flex;
      justify-content: space-between;
      margin: 0 20px 0 20px;
    }
    &--social-links {
      .vmc-logo {
        width: 150px;
        padding: 20px;
        background: left / contain no-repeat;
        background-image: url('https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/02_ValueMyCar_LogotypeNegatif_RVB.png');
      }
      .network {
        &__link {
          margin-left: 30px;
          color: #fff;
          cursor: pointer;
          transition: 0.3s ease;
          & > *:hover {
            transition: 0.2s ease;
            transform: scale(1.2);
          }
          &.YT {
            &:hover {
              color: #ff0000;
              filter: drop-shadow(0 0 2px #ffffff);
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
            }
          }
        }
      }
    }
    &--content {
      display: flex;
      gap: 50px;
      color: #fff;
      .location {
        max-width: calc(1220px / 3);
        & > * {
          display: flex;
          align-items: center;
          margin: 20px 0;
          white-space: nowrap;
          p {
            font-family: 'Nunito';
            font-size: 16px;
            width: 100%;
            margin-left: 5px;
          }
        }
      }
      .about {
        &__wrapper {
          display: flex;
          font-family: 'Montserrat';
          font-size: 16px;
          margin-bottom: 10px;
          &--ul {
            min-width: 50%;
            max-width: calc(1220px / 3);
            margin-bottom: 50px;
            margin-right: 10px;
            li {
              margin-bottom: 10px;
              &:first-child {
                font-weight: 600;
                margin-bottom: 20px;
              }
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
          &--describe {
            max-width: calc(1220px / 3);
            font-size: 16px;
          }
        }
      }
    }
  }
  &.dark-theme {
    background-color: $color-dark-blue;
  }
  &.light-theme {
    background-color: #fff;
    .vmc-logo {
      background-image: url('https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/01_ValueMyCar_LogotypePositif_RVB.png');
    }
    .network__link {
      color: #000;
    }
    .light-theme-content {
      color: #000;
      a {
        color: #000;
        &:hover {
          text-decoration: underline #000;
        }
      }
    }
  }
}

@media screen and (max-width: 730px) {
  .vmc-footer {
    // height: 97vh;
    margin: auto;
    padding-bottom: 25px;
    &__wrapper {
      &--content {
        padding-top: 10px;
        width: 90%;
        flex-direction: column;
        .location {
          & > * {
            p {
              font-size: 14px;
            }
          }
        }
        .about {
          &__wrapper {
            &--ul {
              li {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 530px) {
  .vmc-footer {
    padding-top: 50px;
    &__wrapper {
      padding-bottom: 25px;
      &--social-links {
        flex-direction: column;
        .network {
          margin-top: 25px;
          & > * {
            margin-left: 0;
            margin-right: 12px;
          }
        }
      }
      &--content {
        gap: 10px;
        .about {
          &__wrapper {
            flex-direction: column;
            margin-bottom: 40px;
            &--ul {
              margin-bottom: 10px;
            }
            &--describe {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
