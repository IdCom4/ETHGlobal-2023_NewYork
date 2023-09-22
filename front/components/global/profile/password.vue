<template>
  <div>
    <div class="password__component" tabindex="0" role="button" @click="openModalPassword">
      <label for="password">Mot de passe actuel</label>
      <input type="password" name="password" placeholder="****" disabled /><fa class="password__component--icon" :icon="['far', 'pen-to-square']" />
    </div>
    <vmc-modal :is-open="isModalPasswordOpen" title="Modification de votre mot de passe" @close="closeModalPassword">
      <div class="modalPassword__input">
        <vmc-input
          v-model="currentPassword"
          :type="passwordData[2].type"
          label="Mot de passe actuel"
          placeholder="MotDePasse"
          :icon="passwordData[2].icon"
          @icon-click="() => show_password(2)"
          @input="clearPasswordError"
        />
        <vmc-input
          v-model="newPassword"
          :type="passwordData[0].type"
          label="Nouveau mot de passe"
          placeholder="MotDePasse"
          :icon="passwordData[0].icon"
          :error="passwordError"
          error-grow
          @icon-click="() => show_password(0)"
          @input="clearPasswordError"
        />
        <vmc-input
          v-model="newPasswordConfirmation"
          error-grow
          :type="passwordData[1].type"
          label="Confirmez votre nouveau mot de passe"
          placeholder="MotDePasse"
          :icon="passwordData[1].icon"
          :error="passwordError"
          @icon-click="() => show_password(1)"
          @input="clearPasswordError"
        />
        <p class="information">Votre mot de passe doit avoir le format suivant:</p>
        <ul class="listeInformation">
          <li class="itemInformation">8 caractères</li>
          <li class="itemInformation">1 majuscule</li>
          <li class="itemInformation">1 minuscule</li>
          <li class="itemInformation">1 chiffre</li>
          <li class="itemInformation">1 caractère spécial : !@#$%^&*`</li>
        </ul>
      </div>
      <div class="modalPassword__button">
        <button class="button btn-modal btn btn_call-to-action" @click="updatePassword">Modifier</button>
        <button class="button btn_denied" @click="closeModalPassword">Annuler</button>
      </div>
    </vmc-modal>
  </div>
</template>

<script lang="ts" setup>
import { InputTypes, AlertModes } from '@/types/constants'

const isModalPasswordOpen = ref<boolean>(false)

const openModalPassword = () => {
  isModalPasswordOpen.value = true
}

const closeModalPassword = () => {
  isModalPasswordOpen.value = false
}

const passwordData = ref<Array<{ icon: string; state: boolean; type: InputTypes }>>([
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD },
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD },
  { icon: 'fa-regular fa-eye', state: false, type: InputTypes.PASSWORD }
])

const newPassword = ref<string>('')
const newPasswordConfirmation = ref<string>('')
const currentPassword = ref<string>('')
const passwordError = ref<string>('')

const show_password = (index: number) => {
  passwordData.value[index].state = !passwordData.value[index].state

  if (passwordData.value[index].state) {
    passwordData.value[index].type = InputTypes.TEXT
    passwordData.value[index].icon = 'fa-regular fa-eye-slash'
  } else {
    passwordData.value[index].icon = 'fa-regular fa-eye'
    passwordData.value[index].type = InputTypes.PASSWORD
  }
}

const validatePasswords = () => {
  if (newPassword.value !== newPasswordConfirmation.value) {
    passwordError.value = 'Les mots de passe ne correspondent pas.'
    return false
  } else if (!validatePasswordStrength(newPassword.value)) {
    passwordError.value =
      'Le mot de passe doit contenir au moins 8 caractères avec une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.'
    return false
  } else {
    passwordError.value = ''
    return true
  }
}

const validatePasswordStrength = (password: string) => {
  const hasValidLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*`]/.test(password)

  return hasValidLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar
}

/* >=========== Update password */
const updatePassword = async () => {
  if (!validatePasswords()) {
    return
  }

  if (!validatePasswordStrength(newPassword.value)) {
    return
  }

  const alertControl = {
    mode: AlertModes.ALL,
    successMsg: 'Votre mot de passe a bien été modifié !'
  }

  const result = await useAPI().auth.updatePassword(currentPassword.value, newPassword.value, newPasswordConfirmation.value, alertControl)

  if (!result.error) {
    closeModalPassword()
  }
}
/* <=========== Update user */

const clearPasswordError = () => {
  passwordError.value = ''
}
</script>

<style lang="scss" password>
.password__component {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: space-between;
  border: 1px solid $color-light-grey;
  padding: $spacing-2;
  gap: $spacing-2;

  &--input input {
    border: none;
    cursor: pointer;
  }

  & label {
    cursor: pointer;
  }

  &--icon {
    cursor: pointer;
    position: absolute;
    right: 10px;
  }

  & label {
    margin-left: $spacing-1;
  }
}
.modalPassword {
  &__input {
    display: flex;
    flex-direction: column;
  }

  &__button {
    display: flex;
    justify-content: center;
    gap: $spacing-2;
    margin-top: $spacing-2;
  }
}

.button {
  width: 150px;
}

input[type='password'] {
  border: none;
  padding: $spacing-1;
  cursor: pointer !important;
}

.information,
.itemInformation {
  color: #ed0000;
  font-size: $font-size-2;
  font-weight: $font-weight-1;
  font-style: italic;
}
</style>
