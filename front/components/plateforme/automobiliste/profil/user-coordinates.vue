<template>
  <section class="coordinates">
    <h3>Mes coordonées</h3>
    <div class="email-wrapper" tabindex="0" role="button" title="Modifier votre adresse mail" @click="openModalEmail">
      <div class="email__component" tabindex="0" role="button" @click="openModalEmail">
        <label for="email">Email actuel</label>
        <input class="email__component--input" type="email" name="email" :placeholder="hideEmail(props.user.email)" disabled /><fa
          class="email__component--icon"
          :icon="['far', 'pen-to-square']"
        />
      </div>
    </div>

    <vmc-input v-model="phone" label="Tel" type="tel" placeholder="0000000000" icon="fa-regular fa-floppy-disk" @blur="emitUpdate('phone', phone)" />

    <vmc-input
      v-model="address"
      label="Adresse personnelle"
      type="address"
      placeholder="3 Rue Hélène Boucher, 78125 Gazeran, France"
      icon="fa-regular fa-floppy-disk"
      @blur="emitUpdate('homeAddress', address)"
    />

    <!-- CHANGE EMAIL MODAL  -->
    <change-email :open-modal-email="isModalEmailOpen" :current-email="email" @close-modal-email="closeModalEmail" />
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true
  }
})

const isModalEmailOpen = ref<boolean>(false)

const hideEmail = (email: string) => {
  const [name, domain] = email.split('@')
  const nameLength = name.length
  const maskedName = `${name.charAt(0)}${'*'.repeat(Math.max(nameLength - 6, 0))}${name.charAt(nameLength)}`
  const maskedDomain = `${domain.charAt(0)}${'*'.repeat(Math.max(domain.length - 5, 0))}${domain.charAt(domain.length - 1)}`
  return `${maskedName}@${maskedDomain}`
}

const email = ref<string>(hideEmail(props.user.email))
const phone = ref<string>(props.user.phone)
const address = ref<IStrictAddress>({
  street: props.user.homeAddress?.street || '',
  city: props.user.homeAddress?.city || '',
  zipCode: props.user.homeAddress?.zipCode || '',
  coordinates: props.user.homeAddress?.coordinates || [0, 0]
})

const emitEvent = defineEmits(['update-user', 'close'])
const emitUpdate = (fieldToUpdate: keyof IUpdateProfileRequest, fieldContent: string | IAddress | null | undefined) => {
  emitEvent('update-user', fieldToUpdate, fieldContent)
}

const openModalEmail = () => {
  isModalEmailOpen.value = true
}

const closeModalEmail = () => {
  isModalEmailOpen.value = false
}
</script>

<style lang="scss" scoped>
h3 {
  margin-top: $spacing-3;
}

.email__component {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: space-between;
  border-bottom: 1px solid $color-light-grey;
  gap: $spacing-2;

  &--input {
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

@media (min-width: 900px) {
  h3 {
    margin-top: $spacing-3;
    margin-bottom: $spacing-4;
  }

  .coordinates {
    border: 1px solid black;
    padding: 0 20px 20px;
  }
}
</style>
