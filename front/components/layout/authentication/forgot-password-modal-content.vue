<template>
  <div v-if="!isConfirmed" class="modal-forgot_password">
    <div>
      <h3>Mot de passe oublié ?</h3>
    </div>
    <form>
      <vmc-input
        v-model="email"
        type="email"
        label="Adresse mail"
        class="vmc-input"
        placeholder="Adresse mail"
        :error="formErrors.emailReset"
        modal-style
        error-grow
        @blur="checkEmail"
        @keydown.enter="($event: KeyboardEvent) => { $event.preventDefault(); resetPassword() }"
      />
    </form>
    <div class="flex-buttons">
      <button class="btn_call-to-action" :class="{ '--load': loading }" @click="resetPassword">NOUVEAU MOT DE PASSE</button>
      <button class="btn_call-to-action --white" @click="emits('backConnexion')">RETOUR CONNEXION</button>
    </div>
  </div>
  <div v-else class="modal-confirm">
    <p>
      Nous avons bien reçu votre demande de réinitialisation de mot de passe.
    </p>
    <p>Un e-mail contenant les instructions nécessaires a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception.</p>
    <div>
      <button class="btn_call-to-action" @click="emits('backConnexion')">SE CONNECTER</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emits = defineEmits(['backConnexion'])
const props = defineProps({ email: { type: String, default: '' } })

const loading = ref<boolean>(false)
const email = ref<string>(props.email)
const isConfirmed = ref<boolean>(false)

const formErrors = reactive({
  emailReset: '',
  password: '',
  confirmPassword: ''
})

const resetPassword = async () => {
  if (!checkEmail()) return

  // send email to get link
  loading.value = true
  const response = await useAPI().auth.forgotPassword(email.value)
  loading.value = false

  if (!response.error) isConfirmed.value = true
}

const checkEmail = () => {
  if (!email.value || email.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    formErrors.emailReset = 'Veuillez saisir une adresse email valide'
    loading.value = false

    return false
  } else {
    formErrors.emailReset = ''
    return true
  }
}
</script>
<style lang="scss" scoped>
.flex-buttons {
  display: flex;
  gap: 10px;

  > button {
    width: 100%;
  }
}
</style>
