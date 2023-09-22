<template>
  <div class="home-validate-email">
    <img
      src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/WEBP/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+interieur.webp"
      alt="Centre valuemycar exterieur"
    />
    <vmc-modal :is-open="modalValidateEmail" max-width="500px" @close="redirectToMainPage">
      <vmc-loader v-if="loading" class="loader" :size="35" />
      <div v-else class="modal-validate-email">
        <p v-if="!error">Votre email à bien été validé !</p>
        <p v-else>Nous n'avons pas pu verifier votre email</p>
        <nuxt-link to="/">
          <button class="btn_call-to-action">
            <span v-if="!error">se connecter</span>
            <span v-else>retour à l'accueil</span>
          </button>
        </nuxt-link>
      </div>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const token = useRoute().params.token

const modalValidateEmail = ref<boolean>(true)
const error = ref<boolean>(false)
const loading = ref<boolean>(true)

onMounted(async () => {
  modalValidateEmail.value = true
  const response = await useAPI().auth.validateEmail(token.toString())

  error.value = !!response.error

  loading.value = false
})

// const redirectToMainPage = () => useRouter().push('/')
</script>

<style lang="scss">
html,
body {
  .home-validate-email {
    width: 100%;
    height: 100vh;
    img {
      width: 100vw;
      height: 100%;
      object-fit: cover;
    }
  }
  .loader {
    width: 100%;
    height: auto;
    text-align: center;
    & > * {
      width: 40px;
      height: auto;
    }
  }
  .modal-validate-email {
    text-align: center;
    p {
      margin-bottom: 25px;
    }
    a {
      color: #000;
    }
  }
}
</style>
