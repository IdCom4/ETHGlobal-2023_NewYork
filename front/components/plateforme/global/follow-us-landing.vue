<template>
  <div class="follow-us-landing">
    <div class="follow-us-landing__wrapper">
      <vmc-header
        center
        triple
        text-color="#fff"
        bar-color="#fff"
        text="REJOIGNEZ LA COMMUNAUTÉ DE VALUEMYCAR"
        subtext="La plateforme de mise en relation de l'automobile qui entraine au succès"
      />
      <div class="buttons">
        <nuxt-link to="/authentification/creer-un-compte" title="créer un compte">
          <button class="btn_call-to-action">CRÉEZ UN COMPTE</button>
        </nuxt-link>
        <!-- <nuxt-link to="/" title="abonnez-vous à la Newletter">
          <button class="btn_call-to-action newsletter">NEWSLETTER</button>
        </nuxt-link> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.follow-us-landing {
  width: 100%;
  background-color: $color-dark-blue;
  color: #fff;
  box-shadow: inset 0 25px 45px #000000a4;
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 50px;
    text-align: center;
    max-width: 580px;
    margin: auto;
    padding: 50px 20px;
    .buttons {
      display: flex;
      /* When Newsletter will be done, change the next ligne to space-between */
      justify-content: center;
      width: 100%;
      & > * {
        width: 200px;
        & > * {
          width: 100%;
          &.newsletter {
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
