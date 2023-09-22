<template>
  <mission-quote-item-input
    v-if="isEditing"
    :description-placeholder="props.descriptionPlaceholder"
    :quote-item="props.quoteItem"
    :quote-item-labels="props.quoteItemLabels"
    :error-messages="props.errorMessages"
    @cancel="isEditing = false"
    @add="onEdit"
  />
  <section v-else class="quotation-item">
    <div class="item-content">
      <p>{{ props.quoteItem.description }}</p>
      <p>{{ useEuroUnit(props.quoteItem.unitPriceHT * props.quoteItem.quantity) }}</p>
    </div>
    <div class="edit-delete">
      <fa icon="fa-regular fa-edit" @click="isEditing = true" />
      <fa class="trash-can-icon" icon="fa-solid fa-trash-can" @click="emit('delete')" />
    </div>
  </section>
</template>
<script setup lang="ts">
const emit = defineEmits(['delete', 'edit'])

const props = defineProps({
  quoteItem: {
    type: Object as PropType<IMissionQuoteProduct>,
    default: null,
    required: true
  },
  descriptionPlaceholder: {
    type: String,
    default: ''
  },
  errorMessages: {
    type: Object as PropType<TQuoteItemErrorMessages>,
    default: () => ({
      description: 'Veuillez renseignez ce champ',
      quantity: 'Veuillez renseignez ce champ',
      price: 'Veuillez renseignez ce champ'
    })
  },
  quoteItemLabels: {
    type: Object as PropType<TQuoteItemLabels>,
    default: null,
    required: true
  }
})

const isEditing = ref<boolean>(false)

function onEdit(item: IMissionQuoteProduct) {
  emit('edit', item)
  isEditing.value = false
}
</script>
<style lang="scss" scoped>
.quotation-item {
  display: flex;
  flex-direction: row;
  background-color: #ebebeb;
  padding: 10px;
}

.edit-delete {
  align-self: center;
  display: flex;
  gap: 15px;

  > svg {
    cursor: pointer;
  }
}

.item-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 15px;
  p {
    font-weight: 500;
  }
}

.trash-can-icon {
  color: $color-error;
}
</style>
