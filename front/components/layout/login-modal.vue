<template>
  <eth-modal :is-open="openLoginModal" max-width="500px" @close="closeModalLogin">
    <div v-if="modalState === 'login'" class="modal-login">
      <div>
        <h3>CONNEXION</h3>
        <eth-input
          v-model="formValues.email"
          type="text"
          :modal-style="true"
          placeholder="Adresse email"
          label="Adresse email"
          class="vmc-input email-input"
        />
      </div>
      <div>
        <eth-input
          v-model="formValues.password"
          :type="passwordData.type"
          :modal-style="true"
          label="Mot de passe"
          class="vmc-input password-input"
          placeholder="Mot de passe"
          :required="true"
          :icon="passwordData.icon"
          @icon-click="() => show_password()"
          @keydown.enter="submitLogin"
        />
      </div>
      <div>
        <button class="btn_functional" @click="forgotPassword">
          Mot de passe oublié
        </button>
      </div>
      <div class="flex-buttons">
        <button class="btn_call-to-action" :class="{ '--load': loading }" @click="submitLogin">SE CONNECTER</button>
        <button class="btn_call-to-action --white" :class="{ '--load': loading }" @click="switchToRegisterInterface">Créer un compte</button>
      </div>
    </div>
    <forgot-password-modal-content v-if="modalState === 'password'" :email="formValues.email" @back-connexion="backToLogin" />
    <register-modal-content v-if="modalState === 'register'" @back-connexion="backToLogin" />
  </eth-modal>
</template>

<script lang="ts" setup>
import { AlertModes, GlobalEventTypes, InputTypes } from '@/assets/ts/enums'

type TModalState = 'login' | 'password' | 'register'

const openLoginModal = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalState = ref<TModalState>('login')
const passwordData = ref<{ icon: string; state: boolean; type: InputTypes }>({
  icon: 'fa-regular fa-eye',
  state: false,
  type: InputTypes.PASSWORD
})
const formValues = {
  email: '',
  password: '',
  confirmPassword: ''
}

useGlobalEvents().subscribeTo(GlobalEventTypes.OPEN_LOGIN, () => (openLoginModal.value = true))

const closeModalLogin = () => {
  openLoginModal.value = false
}

const submitLogin = async () => {
  loading.value = true

  const response = await useAPI().auth.login(formValues.email, formValues.password, { mode: AlertModes.ALL, successMsg: 'Vous êtes connecté' })
  if (!response.error) closeModalLogin()

  loading.value = false
}

const forgotPassword = () => {
  modalState.value = 'password'
}

const backToLogin = () => {
  modalState.value = 'login'
}

const switchToRegisterInterface = () => {
  modalState.value = 'register'
}

const show_password = () => {
  passwordData.value.state = !passwordData.value.state

  if (passwordData.value.state) {
    passwordData.value.type = InputTypes.TEXT
    passwordData.value.icon = 'fa-regular fa-eye-slash'
  } else {
    passwordData.value.icon = 'fa-regular fa-eye'
    passwordData.value.type = InputTypes.PASSWORD
  }
}
</script>

<style lang="scss">
.modal-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  padding: 0 20px;
  & > * {
    display: block;
    width: 100%;
    max-width: 750px;
    margin: 0 auto;
  }
  :nth-child(3) {
    display: flex;
    margin: 0;
  }
  :nth-child(4) {
    width: 100%;
    text-align: center;
  }

  .flex-buttons {
    display: flex;
    gap: 10px;

    > button {
      width: 100%;
    }
  }

  #login-security-info {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    background-color: $color-blue;
    border-radius: 10px;
    padding: 10px;

    p {
      margin: 0;
    }

    .icon-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 150px;
      height: 20px;
      width: 20px;
      background-color: white;

      p.icon-text {
        color: $color-blue;
        font-size: 12px;

        .icon {
          height: 13px;
        }
      }
    }

    p.info-text {
      width: calc(100% - 20px);
      color: white;
      line-height: 15px;

      .forgot-password-link-bis {
        white-space: nowrap;
        cursor: pointer;
        font-weight: bold;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  h3 {
    margin-bottom: 25px;
  }
  .password-input {
    margin-top: 15px;
  }
  p {
    margin-bottom: 10px;
    color: $color-error;
  }
}

@media screen and (max-width: 600px) {
  .modal-login {
    padding: 0;
  }
}
</style>
