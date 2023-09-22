<template>
  <div v-if="!isHide" class="rgpd-consent">
    <div class="rgpd-consent-banner">
      <div class="rgpd-consent-banner__wrapper">
        <div class="rgpd-consent-banner__wrapper--hide" @click="isHide = true">
          <fa icon="fa-regular fa-circle-xmark" />
        </div>
        <p class="rgpd-consent-banner__wrapper--title">ValueMyCar respecte votre vie privée</p>
        <div class="rgpd-consent-banner__wrapper--content">
          <p>
            Nous utilisons des traceurs statistiques pour collecter des données anonymes sur la manière dont vous naviguez sur notre site web. Ces
            informations nous aident à comprendre comment nos visiteurs utilisent notre site, à améliorer son fonctionnement et à vous offrir une
            meilleure expérience.
          </p>
          <br />
          <p>
            Les données collectées ne sont pas personnellement identifiables et ne sont pas utilisées à des fins de marketing ciblé. Nous ne
            collectons pas de rgpd, ce qui signifie que nous ne suivons pas votre activité en dehors de notre site.
          </p>
          <br />
          <p>
            Pour plus d'informations sur notre politique de confidentialité et sur la manière dont nous gérons vos données, veuillez consulter notre
            <nuxt-link class="link" to="/rgpd">politique de confidentialité</nuxt-link>. En continuant à utiliser notre site, vous consentez à
            l'utilisation de traceurs statistiques conformément à notre politique de confidentialité.
          </p>
        </div>
        <div class="rgpd-consent-banner__wrapper--buttons">
          <button class="btn_call-to-action decline" @click="isHide = true">Refuser</button>
          <button class="btn_call-to-action accept" @click="acceptRGPD">Accepter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isHide = ref<boolean>(false)

onMounted(() => {
  const storedValue = localStorage.getItem('RGPD-accepted')
  isHide.value = storedValue !== null ? JSON.parse(storedValue) : false
})

function acceptRGPD() {
  localStorage.setItem('RGPD-accepted', JSON.stringify(true))
  isHide.value = true
}
</script>

<style lang="scss" scoped>
.rgpd-consent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0000005e;
  z-index: 9999;
  transition: all 0.3s;
}
.rgpd-consent-banner {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  animation: fadeUp 2s;
  &__wrapper {
    position: relative;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: auto;
    padding: 25px 50px;
    &--hide {
      position: absolute;
      top: -15px;
      right: 2%;
      padding: 5px;
      border-radius: 5px;
      background-color: #fff;
      cursor: pointer;
      & > * {
        color: $color-grey;
        transition: 0.3s;
        &:hover {
          color: #000;
        }
      }
    }
    &--title {
      font-size: 18px;
      font-weight: 700;
    }
    &--content {
      & > * {
        font-weight: 500;
      }
      .link {
        font-weight: 700;
        text-decoration: underline transparent;
        color: #000;
        transition: 0.3s;
        &:hover {
          text-decoration: underline #000;
        }
      }
    }
    &--buttons {
      display: flex;
      gap: 10px;
      & > * {
        width: 150px;
      }
      .decline {
        background-color: $color-light-blue;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .rgpd-consent-banner__wrapper {
    padding: 20px;
    &--buttons {
      justify-content: center;
    }
  }
}

@keyframes fadeUp {
  from {
    bottom: -150px;
  }
  to {
    bottom: 0;
  }
}
</style>
