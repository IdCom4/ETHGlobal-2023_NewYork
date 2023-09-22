<template>
  <!-- CardAdding is for card edition, while the section is for display only -->
  <section>
    <div v-if="isLoading" class="loading" :style="{ height: `${cardHeight}px` }">
      <vmc-loader :size-css="`${cardHeight * 0.8}px`" />
    </div>
    <card-adding-interface
      v-else-if="isEdited"
      :is-editing="true"
      :credit-card="creditCard"
      @delete="onDelete"
      @card-added="onCardAdded"
      @cancel="isEdited = false"
    />
    <section v-else ref="cardElem" class="card-container">
      <input
        :id="cardChoiceId"
        type="radio"
        :name="`${groupName}-credit-card-selected`"
        :checked="isDefaultCard"
        :value="modelValue"
        @input="updateDefaultPaymentMethod"
      />
      <label :for="cardChoiceId" class="card-info" :class="{ 'is-selected': props.modelValue === creditCard.id }">
        <li class="card-row">
          <h5>{{ isDefaultCard ? 'Carte par défaut' : '' }}</h5>
          <fa class="edit-icon" icon="fa-edit" @click="isEdited = true" />
        </li>
        <li class="card-row user-lastdigit">
          <h4>{{ creditCard.brand }}</h4>
          <h4>****{{ creditCard.last4 }}</h4>
        </li>
        <li class="card-row">
          <h5 class="expire">Expire le {{ experity }}</h5>
        </li>
      </label>
    </section>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  paymentMethod: {
    type: Object as PropType<ICreditCard>,
    default: null
  },
  modelValue: {
    type: String,
    default: ''
  },
  groupName: {
    type: String,
    default: ''
  }
})

const creditCard = ref(props.paymentMethod)
const isEdited = ref(false)
const isLoading = ref(false)
const cardElem = ref<HTMLElement>()
const cardHeight = ref<number>(0)
const emit = defineEmits(['delete', 'replace', 'update:modelValue'])

const cardChoiceId = computed(() => {
  return `card-choice-${props.paymentMethod.id}-${props.groupName}`
})

const isDefaultCard = ref<boolean>(props.modelValue === creditCard.value.id)

const experity = computed(() => {
  if (!creditCard.value) return ''
  let expMonth = String(creditCard.value.expMonth)
  expMonth = creditCard.value.expMonth < 10 ? '0' + expMonth : expMonth
  const expYear = String(creditCard.value.expYear).slice(2, 4)

  return `${expMonth} / ${expYear}`
})

function onCardAdded(creditCard: ICreditCard) {
  isEdited.value = false
  emit('replace', props.paymentMethod.id, creditCard)
}

async function updateDefaultPaymentMethod() {
  if (isDefaultCard.value || isLoading.value) return
  if (cardElem.value) cardHeight.value = cardElem.value.getBoundingClientRect().height
  isLoading.value = true

  const alert: IAlertControl = { mode: 'all', successMsg: 'Carte par défaut changée avec succès' }
  const { error } = await usePayment().updateDefaultPaymentMethod(creditCard.value.id, alert)
  isLoading.value = false

  if (!error) emit('update:modelValue', creditCard.value.id)
}

function onDelete() {
  emit('delete', props.paymentMethod.id)
}
</script>

<style lang="scss" scoped>
input[type='radio'] {
  display: none;
  appearance: none;
}
.user-lastdigit {
  > * {
    font-family: 'Montserrat';
  }
}
.card-container {
  display: flex;
  flex-direction: row;
  margin: 6px 0px;
}

.card-info {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  border: 2.85px solid #dcdcdc;
  padding: 5px;
  gap: 4px;
}

.expire {
  color: #686868;
}

.edit-icon {
  cursor: pointer;
}

.is-selected {
  border-color: $color-neon-blue;
}

.card-info:not(.is-selected) {
  cursor: pointer;
}

.card-row {
  display: flex;
  justify-content: space-between;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
