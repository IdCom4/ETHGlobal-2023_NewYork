<template>
  <div class="home-password-recovery">
    <img
      src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/WEBP/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+interieur.webp"
      alt="Centre valuemycar exterieur"
    />
    <vmc-modal :is-open="modalNewPassword" max-width="500px" @close="closeModalNewPassword">
      <form v-if="token" class="password-recovery">
        <div>
          <h3>NOUVEAU MOT DE PASSE</h3>
          <vmc-input
            v-model="formValues.newPassword"
            placeholder="Mot de passe"
            label="Mot de passe"
            :error="formErrors.newPassword"
            type="password"
            modal-style
            error-grow
            required
            @blur="checkPassword"
          />
          <vmc-input
            v-model="formValues.confirmNewPassword"
            placeholder="Confirmez mot de passe"
            label="Confirmez mot de passe"
            :error="formErrors.confirmNewPassword"
            type="password"
            modal-style
            error-grow
            required
            @blur="checkConfirmPassword"
          />
          <div>
            <button class="btn_call-to-action" :class="{ '--load': loading }" @click="checkForm">CONFIRMER</button>
          </div>
        </div>
      </form>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const token = useRoute().params.slug

const modalNewPassword = ref<boolean>(true)
const isValid = ref<boolean>(true)
const loading = ref<boolean>(false)

const formValues = {
  newPassword: '',
  confirmNewPassword: ''
}

const formErrors = reactive({
  newPassword: '',
  confirmNewPassword: ''
})

const closeModalNewPassword = () => {
  modalNewPassword.value = false
  useRouter().push('/')
}

const checkPassword = () => {
  if (!formValues.newPassword || formValues.newPassword.trim() === '' || formValues.newPassword.length < 8) {
    formErrors.newPassword =
      'Vérifiez comprend au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial. Les caractères spéciaux autorisés sont @, $, !, %, *, ? et &.'
    return false
  } else {
    formErrors.newPassword = ''
    return true
  }
}
const checkConfirmPassword = () => {
  if (!formValues.confirmNewPassword || formValues.confirmNewPassword.trim() === '' || formValues.confirmNewPassword !== formValues.newPassword) {
    formErrors.confirmNewPassword = 'Les mots de passe ne correspondent pas'
    return false
  } else {
    formErrors.confirmNewPassword = ''
    return true
  }
}

// Check new password formular before submition
const checkForm = (e: Event) => {
  e.preventDefault()

  if (validateNewPassword() && isValid.value) {
    submitionNewPassword()
  }
}

// New newPassword
const submitionNewPassword = async () => {
  loading.value = true
  const { error } = await useAPI().auth.passwordRecovery(token.toString(), formValues.newPassword, formValues.confirmNewPassword, {
    mode: 'all',
    successMsg: 'Votre mot de passe a été mis à jour, vous pouvez vous connecter'
  })
  // redirect route
  if (!error) useRouter().push('/')
  loading.value = false
}

// Validations of every passwords functions
const validationsNewPassword = [checkPassword, checkConfirmPassword]
const validateNewPassword = () => {
  let isNewPasswordValid = true

  // Check each fileds are valid
  for (const validation of validationsNewPassword) {
    !validation() && (isNewPasswordValid = false)
  }

  isValid.value = isNewPasswordValid

  return isNewPasswordValid
}
</script>

<style lang="scss">
html,
body {
  // overflow: hidden;
}
.home-password-recovery {
  width: 100%;
  height: 100vh;
  img {
    width: 100vw;
    height: 100%;
    object-fit: cover;
  }
}
.password-recovery {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  & > * {
    display: block;
    width: 100%;
    max-width: 750px;
    margin: 25px auto 0 auto;
  }
  :nth-child(3) {
    margin-top: 25px;
  }
  :nth-child(4) {
    width: 100%;
    text-align: center;
  }
  h3 {
    margin-bottom: 25px;
  }
  div {
    button {
      margin-top: 25px;
    }
  }
  p {
    margin-bottom: 10px;
    color: $color-error;
  }
}
</style>
