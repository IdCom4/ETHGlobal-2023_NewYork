<template>
  <section class="quote-item-adding-section">
    <fa class="cancel-icon" icon="fa-regular fa-circle-xmark" @click="emit('cancel')" />
    <vmc-input
      v-model="quoteItem.description"
      type="text"
      :label="props.quoteItemLabels.description"
      :placeholder="props.descriptionPlaceholder"
      :error="formValidator.getErrorsOf('description')[0]"
      modal-style
      @input="formValidator.validateOne('description')"
      @blur="formValidator.validateOne('description')"
    />
    <div class="quote-hours">
      <vmc-input
        v-model="quoteItem.quantity"
        type="number"
        :label="props.quoteItemLabels.quantity"
        :error="formValidator.getErrorsOf('quantity')[0]"
        modal-style
        @input="formValidator.validateOne('quantity')"
        @blur="formValidator.validateOne('quantity')"
      />
      <vmc-input
        v-model="quoteItem.unitPriceHT"
        type="number"
        :label="props.quoteItemLabels.unitPriceHT"
        :error="formValidator.getErrorsOf('unitPriceHT')[0]"
        modal-style
        @input="formValidator.validateOne('unitPriceHT')"
        @blur="formValidator.validateOne('unitPriceHT')"
      />
    </div>

    <div class="total-to-pay">
      <p class="largest">Total TTC</p>
      <p class="largest">{{ totalTTC }}</p>
    </div>

    <button class="btn_call-to-action" @click="emitNewItem">Validez</button>
  </section>
</template>
<script setup lang="ts">
import { FormValidator } from '@/composables/useValidator'

const emit = defineEmits(['add', 'cancel'])

const props = defineProps({
  quoteItem: {
    type: Object as PropType<IMissionQuoteProduct>,
    default: null
  },
  descriptionPlaceholder: {
    type: String,
    default: ''
  },
  errorMessages: {
    type: Object as PropType<TQuoteItemErrorMessages>,
    default: () => ({
      description: 'Ce champs doit contenir au moins 3 caractères',
      quantity: 'Veuillez renseignez ce champ',
      price: 'Le prix doit être supérieur à 0.10€'
    })
  },
  quoteItemLabels: {
    type: Object as PropType<TQuoteItemLabels>,
    default: null,
    required: true
  }
})

const quoteItem = ref<IMissionQuoteProduct>(
  props.quoteItem
    ? (useUtils().objects.clone(props.quoteItem) as IMissionQuoteProduct)
    : {
        description: '',
        quantity: 0,
        unitPriceHT: 0
      }
)

const formValidator = ref<FormValidator<IMissionQuoteProduct>>(
  useValidator().createFormValidator<IMissionQuoteProduct>({
    description: {
      getter: () => quoteItem.value.description,
      validate: (description?: string) => (description && description.length >= 3 ? [] : ['La description doit faire 3 caractères minimum'])
    },
    quantity: {
      getter: () => quoteItem.value.quantity,
      validate: (quantity?: number) => (quantity && quantity >= 0.1 ? [] : ['Ne peut pas être inférieur à 0.1'])
    },
    unitPriceHT: {
      getter: () => quoteItem.value.unitPriceHT,
      validate: (unitPriceHT?: number) => (unitPriceHT && unitPriceHT >= 0.1 ? [] : ['Ne peut pas être inférieur à 0.1'])
    }
  })
)

const totalTTC = computed<string>(() => useEuroUnit(quoteItem.value.quantity * quoteItem.value.unitPriceHT))

function emitNewItem() {
  if (!formValidator.value.validateForm()) return

  emit('add', quoteItem.value)
}
</script>

<style lang="scss" scoped>
.quote-item-adding-section {
  border: solid 1px $black;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;

  button {
    width: 100%;
  }
}

.cancel-icon {
  align-self: flex-end;
  cursor: pointer;
}

.total-to-pay {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  & > :nth-child(2) {
    font-weight: 800;
  }
}
.quote-hours {
  display: flex;
  gap: 10px;

  > section {
    flex-grow: 1;
    width: 100%;
  }
}
</style>
