<template>
  <div>
    <vmc-modal :is-open="props.openModalEmail" max-width="500px" @close="closeModalEmail">
      <!-- MODAL TO CHANGE EMAIL -->
      <form v-if="isEditing" class="wrapper-email-edit">
        <vmc-input v-model="formValues.currentEmail" label="Email actuel" type="email" :placeholder="props.currentEmail" />
        <vmc-input v-model="formValues.newEmail" label="Nouvel email" type="email" placeholder="Votre nouvel email" />
        <vmc-input v-model="formValues.password" label="Mot de passe" type="password" placeholder="Votre mot de passe" />
        <p class="error-message">{{ userError }}</p>
        <button class="btn_call-to-action" :class="{ '--load': isLoad }" @click="newEmailAddress">Confirmer</button>
      </form>

      <!-- MODAL OF CONFIRAMTION -->
      <div v-else class="confirm">
        <p>Vous devez confirmer votre adresse e-mail pour vous reconnecter.</p>
        <button class="btn_call-to-action" @click="closeModalEmail">Quitter</button>
      </div>
    </vmc-modal>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close-modal-email'])

const props = defineProps({
  openModalEmail: {
    type: Boolean,
    default: false
  },
  currentEmail: {
    type: String,
    default: ''
  }
})

const isEditing = ref<boolean>(true)
const userError = ref<string>('')
const isLoad = ref<boolean>(false)

const formValues = reactive({
  currentEmail: '',
  newEmail: '',
  password: ''
})

const closeModalEmail = () => {
  emit('close-modal-email', true)
  isEditing.value = true
}

const newEmailAddress = async (e: Event) => {
  e.preventDefault()
  isLoad.value = true

  const { data, error } = await useAPI().auth.updateEmail(formValues.currentEmail, formValues.newEmail, formValues.password)

  data && (isEditing.value = !isEditing.value)

  if (data === null || error) {
    userError.value = 'Les informations fournies sont invalides. Veuillez vérifier vos saisies et réessayer.'
  }
  isLoad.value = false
}
</script>

<style lang="scss" scoped>
.email-wrapper {
  width: 100%;
  height: fit-content;
  cursor: pointer;
}
// MODAL
.wrapper-email-edit {
  text-align: center;
  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 25px;
    padding: 5px;
    font-weight: 700;
    color: $color-error;
  }
}

.confirm {
  text-align: center;
  p {
    min-height: 25px;
    padding: 5px;
    font-weight: 600;
  }
}
</style>
