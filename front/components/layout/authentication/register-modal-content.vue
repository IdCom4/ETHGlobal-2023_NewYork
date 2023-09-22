<template>
  <tracking-section v-if="isRegistrationSuccess" class="register-success">
    <h1></h1>
    <h4>Votre compte à été crée !</h4>
    <p class="largest">Un mail de confirmation vous a été envoyé, veuillez valider votre émail puis revenir sur cette page pour vous connecter</p>
    <button class="btn_call-to-action" @click="emits('backConnexion')">Se connecter</button>
  </tracking-section>
  <section v-else class="register-modal">
    <h3>Créer un compte</h3>
    <eth-input
      v-model="registerInformations.name"
      type="text"
      :modal-style="true"
      placeholder="Prénom"
      label="Prénom"
      class="vmc-input email-input"
      :error="registerErrors.name.msg"
      @blur="registerErrors.name.testFunc"
      @input="testFuncWithoutNewErrorDisplay('name')"
    />

    <eth-input
      v-model="registerInformations.lastName"
      type="text"
      :modal-style="true"
      placeholder="Nom"
      label="Nom"
      class="vmc-input email-input"
      :error="registerErrors.lastName.msg"
      @blur="registerErrors.lastName.testFunc"
      @input="testFuncWithoutNewErrorDisplay('lastName')"
    />
    <eth-input
      v-model="registerInformations.email"
      type="text"
      :modal-style="true"
      placeholder="Adresse email"
      label="Adresse email"
      class="vmc-input email-input"
      :error="registerErrors.email.msg"
      @blur="registerErrors.email.testFunc"
      @input="testFuncWithoutNewErrorDisplay('email')"
    />

    <eth-input
      v-model="registerInformations.phone"
      type="tel"
      :modal-style="true"
      placeholder="Numéro de téléphone"
      label="Téléphone"
      class="vmc-input email-input"
      :error="registerErrors.phone.msg"
      @blur="registerErrors.phone.testFunc"
      @input="testFuncWithoutNewErrorDisplay('phone')"
    />
    <eth-input
      v-model="registerInformations.password"
      :type="passwordShow.regular ? InputTypes.TEXT : InputTypes.PASSWORD"
      :modal-style="true"
      label="Mot de passe"
      class="vmc-input password-input"
      placeholder="Mot de passe"
      :required="true"
      :icon="passwordShow.regular ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
      :error="registerErrors.password.msg"
      @icon-click="() => showPassword('regular')"
      @blur="registerErrors.password.testFunc"
      @input="testFuncWithoutNewErrorDisplay('password')"
    />
    <eth-input
      v-model="registerInformations.confirmPassword"
      :type="passwordShow.confirm ? InputTypes.TEXT : InputTypes.PASSWORD"
      :modal-style="true"
      label="Confirmez votre mot de passe"
      class="vmc-input password-input"
      placeholder="Mot de passe"
      :required="true"
      :icon="passwordShow.confirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
      @icon-click="() => showPassword('confirm')"
      @blur="registerErrors.password.testFunc"
      @input="testFuncWithoutNewErrorDisplay('password')"
    />

    <div class="flex-buttons">
      <button class="btn_call-to-action" :class="{ '--load': buttonLoading }" @click="confirmRegister">Créer un compte</button>
      <button class="btn_call-to-action --white" @click="emits('backConnexion')">Se connecter</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { InputTypes } from '@/assets/ts/enums'

interface IRegisterPayload {
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

type TPasswordType = 'regular' | 'confirm'

const emits = defineEmits(['backConnexion'])

const registerInformations = ref<IRegisterPayload>({
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

const registerErrors = ref<Record<keyof IRegisterPayload, { msg: string; testFunc: () => void }>>({
  name: { msg: '', testFunc: () => void 0 },
  lastName: { msg: '', testFunc: () => void 0 },
  email: { msg: '', testFunc: () => void 0 },
  password: { msg: '', testFunc: () => void 0 },
  confirmPassword: { msg: '', testFunc: () => void 0 },
  phone: { msg: '', testFunc: () => void 0 }
})

const passwordShow = ref<Record<TPasswordType, boolean>>({
  regular: false,
  confirm: false
})

const buttonLoading = ref<boolean>(false)
const isRegistrationSuccess = ref<boolean>(false)

const showPassword = (passwordType: TPasswordType) => {
  passwordShow.value[passwordType] = !passwordShow.value[passwordType]
}

registerErrors.value.email.testFunc = () => {
  registerErrors.value.email.msg = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInformations.value.email)) {
    registerErrors.value.email.msg = 'Veuillez saisir une adresse email valide'
  }
}

registerErrors.value.phone.testFunc = () => {
  registerErrors.value.phone.msg = ''
  if (!/^(?:\+33|0)[1-9](?:\d{2}){4}$/.test(registerInformations.value.phone))
    registerErrors.value.phone.msg = 'Veuillez saisir un numéro de téléphone valide'
  return ''
}

registerErrors.value.password.testFunc = () => {
  registerErrors.value.password.msg = ''
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(registerInformations.value.password))
    registerErrors.value.password.msg =
      'Vérifiez que votre mot de passe comprend au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial ainsi que 8 charactères au mininum'
  else if (registerInformations.value.password !== registerInformations.value.confirmPassword)
    registerErrors.value.password.msg = 'Les mots de passes de correspondent pas'
}

registerErrors.value.name.testFunc = () => {
  registerErrors.value.name.msg = ''
  if (!registerInformations.value.name) registerErrors.value.name.msg = 'Veuillez saisir votre prénom'
}

registerErrors.value.lastName.testFunc = () => {
  registerErrors.value.lastName.msg = ''
  if (!registerInformations.value.lastName) registerErrors.value.lastName.msg = 'Veuillez saisir votre nom'
}

//We use the test function but It cannot add a error message but can remove it, the utility is for removing error msgs when user types
function testFuncWithoutNewErrorDisplay(informationName: keyof IRegisterPayload) {
  const inititalErrorMsg = registerErrors.value[informationName].msg
  registerErrors.value[informationName].testFunc()
  if (!inititalErrorMsg) registerErrors.value[informationName].msg = ''
}

const confirmRegister = async () => {
  //test all error check functions
  for (const err of Object.values(registerErrors.value)) {
    err.testFunc()
  }

  const hasError = Object.values(registerErrors.value).some((err) => err.msg)

  if (hasError) return

  buttonLoading.value = true

  const registerRes = await useAPI().auth.register(
    registerInformations.value.name,
    registerInformations.value.lastName,
    registerInformations.value.phone,
    registerInformations.value.email,
    registerInformations.value.password
  )

  buttonLoading.value = false

  if (!registerRes.error) {
    isRegistrationSuccess.value = true
  }
}
</script>

<style lang="scss" scoped>
.register-modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.register-success {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.flex-buttons {
  display: flex;
  gap: 10px;

  > button {
    width: 100%;
  }
}
</style>
