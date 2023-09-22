<template>
  <section class="personalInformation">
    <h3>Mes informations personnelles</h3>
    <vmc-input
      v-model="lastName"
      label="Nom"
      type="text"
      placeholder="Votre nom de famille"
      icon="fa-regular fa-floppy-disk"
      @blur="emitUpdate('lastName', lastName)"
    />
    <vmc-input
      v-model="name"
      label="Prénom"
      type="text"
      placeholder="Votre prénom"
      icon="fa-regular fa-floppy-disk"
      @blur="emitUpdate('name', name)"
    />
    <vmc-input v-model="sex" label="Sexe" type="select" placeholder="Votre sexe" :select-options="sexOptions" icon="fa-regular fa-floppy-disk" />
    <vmc-input
      v-model="birthday"
      label="Date de naissance"
      type="date"
      placeholder="01/01/1970"
      icon="fa-regular fa-floppy-disk"
      @blur="emitUpdate('birthday', birthday)"
    />
  </section>
</template>

<script setup lang="ts">
import { Sexes } from '@/types/constants/models/user'
const sexOptions = ref<IInputSelectOptions<Sexes>[]>([
  {
    value: Sexes.MAN,
    display: 'Homme'
  },
  {
    value: Sexes.WOMAN,
    display: 'Femme'
  },
  {
    value: Sexes.OTHER,
    display: 'Autre'
  }
])

const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true
  }
})

const name = ref<string>(props.user.name)
const lastName = ref<string>(props.user.lastName)
const sex = ref(props.user.sex)
const birthday = ref<string | null>(props.user.birthday || null)

const emitEvent = defineEmits(['update-user', 'close'])
const emitUpdate = (field: string, fieldsToUpdate: string | IAddress | null | undefined) => emitEvent('update-user', field, fieldsToUpdate)

watch(sex, () => {
  emitUpdate('sex', sex.value)
})
</script>

<style lang="scss" scoped>
h3 {
  margin-top: $spacing-3;
}

@media (min-width: 900px) {
  h3 {
    margin-top: $spacing-3;
    margin-bottom: $spacing-4;
  }
  .personalInformation {
    border: 1px solid black;
    padding: 0 20px 20px;
  }
}
</style>
