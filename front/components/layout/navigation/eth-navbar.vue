<template>
  <section id="navbar-center">
    <div class="center-menu --blur">
      <div class="responsive">
        <!-- HAMBURGER -->
        <div class="hamburger-menu-top" :class="{ 'is-open': isHamburgerOpen }" @click="isHamburgerOpen = !isHamburgerOpen">
          <div class="bar-top"></div>
          <div class="bar-middle"></div>
          <div class="bar-bottom"></div>
        </div>
      </div>
      <div class="middlebar-center" :class="{ 'is-open': isHamburgerOpen }" @click.self="isHamburgerOpen = false">
        <ul>
          <!-- LINKS -->
          <li v-for="(link, index) in selectedLinks" :key="`navbar-links-${index}`">
            <nuxt-link :to="link.to" :title="link.title" @click="isHamburgerOpen = false">{{ link.label }}</nuxt-link>
          </li>

          <!-- LOGOUT -->
          <li @click="logout">
            <nuxt-link to="/never" title="Logout" @click="isHamburgerOpen = false">
              Logout
            </nuxt-link>
          </li>
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
interface ILink {
  to: string
  title: string
  label: string
}
const isHamburgerOpen = ref<boolean>(false)

/* eslint-disable prettier/prettier */
const links: ILink[] = [
  { 'to': '/', 'title': '/', 'label': 'Home' },
  { 'to': '/0', 'title': '/', 'label': 'My playlists' },
  { 'to': '/1', 'title': '/', 'label': 'My account' },
  { 'to': '/2', 'title': '/', 'label': 'Settings' },
]

const dashboardLinks : ILink[] = [
  { 'to': '/', 'title': '/', 'label': 'Dashboard' },
  { 'to': '/2', 'title': '/', 'label': 'Settings' },
]
/* eslint-enable prettier/prettier */

const selectedLinks = computed(() => (useRoute().fullPath.includes('dashboard') ? dashboardLinks : links))
</script>

<style lang="scss">
[hidden] {
  display: none !important;
}

.center-menu {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 60px;
  padding: 0 20px;
  box-shadow: 0 -3px 30px #000000;
  z-index: 99;
  background-color: $color-dark-blue;
  * {
    color: white !important;
  }
  &.--bg-white {
    background-color: #fff;
  }
  .responsive {
    display: none;
  }
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
  height: 60px;
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
    .responsive {
      display: flex;
      justify-content: right;
      align-items: center;
      height: 60px;
      .hamburger-menu-top {
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
      }
    }
  }

  .viewport-centre-menu {
    height: 60px;
  }
}
</style>
