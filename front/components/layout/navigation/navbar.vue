<template>
  <section id="navbar-center">
    <div class="center-menu --blur" :class="[navbarBackgroundColor]">
      <div class="topbar-center">
        <div>
          <nuxt-link to="/" title="Accueil Rambouillet" @click="isHamburgerOpen = false">
            <h1 :data-state="navbarBackgroundColor === 'dark-theme' ? 'dark' : ''"></h1>
          </nuxt-link>
          <p v-if="useRoute().path.includes(URLs.CENTER)">Rambouillet</p>
        </div>

        <!-- HAMBURGER -->
        <div class="hamburger-menu-top" :class="{ 'is-open': isHamburgerOpen }" @click="isHamburgerOpen = !isHamburgerOpen">
          <div class="bar-top"></div>
          <div class="bar-middle"></div>
          <div class="bar-bottom"></div>
        </div>

        <!-- SOCIAL NETWORK -->
        <div class="network">
          <a href="https://www.facebook.com/Valuemycar.centres/" title="Suivez-nous sur Facebook" target="_blank">
            <fa :icon="['fab', 'fa-square-facebook']" />
          </a>
          <a href="https://www.instagram.com/valuemycar.rambouillet/?hl=fr" title="Suivez-nous sur Instagram" target="_blank">
            <fa :icon="['fab', 'instagram']" />
          </a>
          <a href="https://www.linkedin.com/company/valuemycar-fr/" title="Suivez-nous sur LinkedIn" target="_blank">
            <fa :icon="['fab', 'linkedin']" />
          </a>
          <a href="https://www.tiktok.com/@valuemycar.rambouillet" title="Suivez-nous sur Tik-Tok" target="_blank">
            <fa :icon="['fab', 'tiktok']" />
          </a>
        </div>
      </div>

      <div class="middlebar-center" :class="{ 'is-open': isHamburgerOpen }" @click.self="isHamburgerOpen = false">
        <ul>
          <!-- LINKS -->
          <li v-for="(link, index) in selectedLinks" :key="`navbar-links-${index}`">
            <nuxt-link :to="link.to" :title="link.title" @click="isHamburgerOpen = false">{{ link.label }}</nuxt-link>
          </li>

          <!-- LOGOUT -->
          <li v-if="isLoggedIn" @click="logout">
            <nuxt-link
              :to="useRoute().path.includes(`/${URLs.PLATEFORME}`) ? `/${URLs.PLATEFORME}/automobiliste` : `/${URLs.CENTER}/`"
              title="Déconnexion"
              @click="isHamburgerOpen = false"
            >
              Déconnexion
            </nuxt-link>
          </li>

          <!-- LOGIN & REGISTER -->
          <div v-if="!isLoggedIn" class="login-signup">
            <button class="btn_call-to-action" @click="openLoginModal">SE CONNECTER</button>
            <nuxt-link to="/authentification/creer-un-compte" @click="isHamburgerOpen = false">
              <button class="btn_call-to-action --white">CREER UN COMPTE</button>
            </nuxt-link>
          </div>
        </ul>

        <div hidden class="hamburger-menu-middle" :class="{ 'is-open': isHamburgerOpen }" @click="isHamburgerOpen = !isHamburgerOpen">
          <div class="bar-top"></div>
          <div class="bar-middle"></div>
          <div class="bar-bottom"></div>
        </div>
      </div>
    </div>
    <div class="viewport-centre-menu"></div>
  </section>
</template>

<script lang="ts" setup>
import { GlobalEventTypes } from '@/types/constants'
import { storeToRefs } from 'pinia'

enum ThemeVersions {
  LIGHT = 'light',
  DARK = 'dark'
}

enum URLs {
  CENTER = 'centres',
  PLATEFORME = 'plateforme'
}

enum UserTypes {
  NOT_LOGGED = 0,
  LOGGED = 1,
  CLIENT = 2,
  PROFESSIONAL = 3
}

interface ILink {
  to: string
  title: string
  label: string
  forbiddenTo: UserTypes[]
}

const { isLoggedIn, isProfessional } = storeToRefs(useSessionStore())
const isHamburgerOpen = ref<boolean>(false)
const navbarBackgroundColor = ref<string>('light-theme')

/* eslint-disable prettier/prettier */
const centersLinks: ILink[] = [
  { to: `/${URLs.CENTER}`, title: 'Accueil Center', label: 'Accueil', forbiddenTo: [] },
  { to: `/${URLs.CENTER}/services`, title: 'Visitez nos services esthétique', label: 'Services esthétiques', forbiddenTo: [] },
  { to: `/${URLs.CENTER}/reservation/WASHBOX`, title: 'Réserver un boxe', label: 'Réserver un boxe', forbiddenTo: [UserTypes.PROFESSIONAL] },
  { to: `/${URLs.CENTER}/boxes/box-mecanique`, title: 'Visitez nos boxes mécaniques', label: 'Box mécanique', forbiddenTo: [] },
  { to: `/${URLs.CENTER}/boxes/box-lavage`, title: 'Visitez nos boxes lavages', label: 'Box lavage', forbiddenTo: [] },
  { to: `/${URLs.CENTER}/boxes/box-detailing`, title: 'Visitez nos boxes esthétiques', label: 'Box esthétique', forbiddenTo: [] },
  { to: `/${URLs.PLATEFORME}/automobiliste/profil`, title: 'Mon compte automobiliste', label: 'Mon compte', forbiddenTo: [UserTypes.NOT_LOGGED, UserTypes.PROFESSIONAL] },
  { to: `/${URLs.PLATEFORME}/automobiliste`, title: 'Retourner aux missions', label: 'Retourner aux missions', forbiddenTo: [] },
]

const plateformeLinks: ILink[] = [
  { to: `/${URLs.PLATEFORME}/specialiste`, title: 'Accueil Professionel', label: 'Accueil', forbiddenTo: [UserTypes.NOT_LOGGED, UserTypes.CLIENT] },
  { to: `/${URLs.PLATEFORME}/automobiliste`, title: 'Accueil Automobiliste', label: 'Accueil', forbiddenTo: [UserTypes.PROFESSIONAL] },
  { to: `/${URLs.PLATEFORME}/automobiliste/nouvelle-demande`, title: 'Creer une nouvelle demande', label: 'Demander un devis', forbiddenTo: [] },
  { to: `/${URLs.PLATEFORME}/automobiliste/mes-demandes/coucou`, title: 'Mes demandes', label: 'Mes demandes', forbiddenTo: [UserTypes.NOT_LOGGED] },
  { to: `/${URLs.PLATEFORME}/specialiste/mes-missions`, title: 'Mes missions spécialiste', label: 'Mes missions spécialiste', forbiddenTo: [UserTypes.NOT_LOGGED, UserTypes.CLIENT] },
  { to: `/${URLs.PLATEFORME}/specialiste/profil`, title: 'Mon profil spécialiste', label: 'Mon profil spécialiste', forbiddenTo: [UserTypes.NOT_LOGGED, UserTypes.CLIENT] },
  { to: `/${URLs.PLATEFORME}/automobiliste/profil`, title: 'Mon compte Automobiliste', label: 'Mon compte', forbiddenTo: [UserTypes.NOT_LOGGED] },
  { to: `/${URLs.CENTER}`, title: 'Naviguer vers le Centre Rambouillet', label: 'Le Centre', forbiddenTo: [UserTypes.NOT_LOGGED] }
]
/* eslint-enable prettier/prettier */

const selectedLinks = ref<ILink[]>([])

function updateSelectedLinks() {
  const linksForURL = useRoute().path.includes(URLs.CENTER) ? centersLinks : plateformeLinks
  const isClient = isLoggedIn.value && !isProfessional.value
  const isNotLogged = !isLoggedIn.value

  selectedLinks.value = linksForURL.filter((link) => {
    // if link exclude professional and user is one, return false
    if (isProfessional.value && link.forbiddenTo.includes(UserTypes.PROFESSIONAL)) return false
    // if link exclude client and user is one, return false
    if (isClient && link.forbiddenTo.includes(UserTypes.CLIENT)) return false
    // if link exclude not logged and user is one, return false
    if (isNotLogged && link.forbiddenTo.includes(UserTypes.NOT_LOGGED)) return false

    return true
  })
}

/* UPDATE NAVBAR */
useGlobalEvents().subscribeTo<ThemeVersions>(
  GlobalEventTypes.UPDATE_NAVBAR_THEME,
  (payload?: ThemeVersions) => !!(navbarBackgroundColor.value = `${payload || ThemeVersions.LIGHT}-theme`)
)

watch(() => useRoute().path, updateSelectedLinks)
watch(isLoggedIn, updateSelectedLinks)
onBeforeMount(updateSelectedLinks)

function openLoginModal() {
  useGlobalEvents().emitEvent(GlobalEventTypes.OPEN_LOGIN)
}

function logout() {
  useAPI().auth.logout()
}

function checkSessionAndFetchProfile() {
  useAPI().users.getProfile()
}

// at each first page load, try to fetch the profile
// so that if the session expired server wise and tells us as much,
// the user is gracefully and seamlessly disconnected front wise
checkSessionAndFetchProfile()
</script>

<style lang="scss">
[hidden] {
  display: none !important;
}

.center-menu {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 120px;
  padding: 0 20px;
  box-shadow: 0 -3px 30px #000000;
  z-index: 99;
  &.--blur {
    &.light-theme {
      background-color: #ffffff28;
      backdrop-filter: blur(10px);
    }

    &.dark-theme {
      background-color: #0c1533;
      color: white;

      .topbar-center,
      .middlebar-center {
        a {
          color: white;
        }
      }
    }
  }
  &.--bg-white {
    background-color: #fff;
  }
  .topbar-center {
    border-bottom: solid 0.5px;
  }
  .topbar-center,
  .middlebar-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    a.router-link-active {
      text-decoration: underline #000 1.5px;
    }
    :first-child {
      display: flex;
      align-items: center;
      h1 {
        margin: 0 10px;
      }
      p {
        font-family: 'Montserrat';
        font-size: 9px;
        font-weight: 800;
      }
    }
    .network {
      display: flex;
      a {
        margin: 0 10px;
        color: #000;
      }
    }
  }
  .middlebar-center {
    display: flex;
    justify-content: flex-end;
    ul {
      li {
        font-family: 'Montserrat';
        font-size: 12px;
        font-weight: 700;
        margin: 0 10px;
        cursor: pointer;
        a {
          transition: 0.3s;
          text-decoration: underline transparent 1.5px;
          color: #000;
          &:hover {
            text-decoration: underline #000 1.5px;
          }
        }
      }
    }
    .login-signup {
      display: flex;
      padding: 0 20px;
      min-width: 21px;
      min-height: 34px;
      border-right: solid 1px;
      a {
        text-decoration: none;
        color: #000;
      }
      button {
        margin: 0 5px;
      }
    }
    .hamburger-menu-middle {
      margin: 1.2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 2rem;
      width: 2rem;
      cursor: pointer;
      z-index: 999;
    }
    .bar-top,
    .bar-middle,
    .bar-bottom {
      height: 4px;
      background: #000;
      border-radius: 3px;
      margin: 3px 0;
      transform-origin: left;
      transition: all 0.5s;
    }

    .is-open .bar-top {
      transform: rotate(45deg);
    }
    .is-open .bar-middle {
      transform: translateX(0.7rem);
      opacity: 0;
    }
    .is-open .bar-bottom {
      transform: rotate(-45deg);
    }
  }
}

.viewport-centre-menu {
  top: 0;
  left: 0;
  width: 100vw;
  height: 120px;
}

.modal-confirm {
  p {
    max-width: 650px;
    margin: 20px auto;
    text-align: center;
  }
  p:first-of-type {
    font-weight: 600;
  }
  :nth-child(3) {
    width: 100%;
    text-align: center;
  }
}

@media screen and (max-width: 740px) {
  .center-menu {
    height: 60px;
    .topbar-center {
      border-bottom: none;
      .network {
        display: none;
      }
      .hamburger-menu-top {
        margin: 1.2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 2rem;
        width: 2rem;
        cursor: pointer;
      }
      .bar-top,
      .bar-middle,
      .bar-bottom {
        height: 4px;
        background: #000;
        border-radius: 3px;
        margin: 3px 0;
        transform-origin: left;
        transition: all 0.5s;
      }

      .is-open .bar-top {
        transform: rotate(45deg);
      }
      .is-open .bar-middle {
        transform: translateX(0.7rem);
        opacity: 0;
      }
      .is-open .bar-bottom {
        transform: rotate(-45deg);
      }
    }

    .middlebar-center {
      position: fixed;
      display: flex;
      top: 59px;
      left: 100vw;
      width: 100vw;
      height: 100vh;
      background-color: rgba(44, 44, 44, 0.338);

      &.is-open {
        left: 0;
      }

      ul {
        display: block !important;
        position: absolute;
        right: 0;
        width: 80vw;
        max-width: 600px;
        height: 100vh;
        padding: 50px;
        background-color: #fff;
        li {
          margin: 25px 0;
          font-family: 'Nunito';
          font-size: 12px;
          font-weight: 500;
          transition: 0.3s;
          a {
            color: #000 !important;
            text-decoration: none;
          }
          &:hover {
            transform: translateX(5px);
            font-weight: 800;
          }
        }
        .login-signup {
          display: block;
          justify-content: space-between;
          padding: 0;
          border: unset;

          :first-child {
            margin-bottom: 15px;
          }

          button {
            margin: 0;
            width: 100%;
            justify-content: center;
          }
          a {
            color: #000;
          }
        }
      }
    }

    &.dark-theme {
      .bar-top,
      .bar-middle,
      .bar-bottom {
        background: white;
      }
    }
  }

  .viewport-centre-menu {
    height: 60px;
  }
}
</style>
