<template>
  <section class="quote-products-input-section">
    <h3>Outils de devis</h3>
    <div class="quote-products-input-list">
      <h4>{{ category }}<span v-if="optional" style="text-transform: lowercase;"> (facultatif)</span></h4>

      <ul>
        <mission-quote-item-updatable-card
          v-for="(item, index) in items"
          :key="`item-quotation-${groupSeed}-${index}`"
          :quote-item="item"
          :quote-item-labels="labels"
          description-placeholder="Nom du service effectué"
          @delete="onItemDelete(index)"
          @edit="(item: IMissionQuoteProduct) => onItemEdit(index, item)"
        />
      </ul>
    </div>

    <mission-quote-item-input
      v-if="isAddingItem"
      :quote-item-labels="labels"
      :description-placeholder="`${labels.description} ...`"
      @cancel="isAddingItem = false"
      @add="onItemAdded"
    />

    <mission-quote-item-add-button v-else @trigger="isAddingItem = true" />
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Array as PropType<IMissionQuoteProduct[]>,
    default: () => []
  },
  category: {
    type: String,
    required: true
  },
  labels: {
    type: Object as PropType<TQuoteItemLabels>,
    required: true
  },
  optional: {
    type: Boolean,
    default: false
  }
})

const groupSeed = Math.random()
const items = ref<IMissionQuoteProduct[]>(props.modelValue)
const isAddingItem = ref<boolean>()

watch(
  () => props.modelValue,
  () => {
    items.value = props.modelValue
  }
)

function onItemDelete(itemIndex: number) {
  items.value.splice(itemIndex, 1)
  emit('update:modelValue', items.value)
}

function onItemAdded(item: IMissionQuoteProduct) {
  items.value.push(item)
  isAddingItem.value = false
  emit('update:modelValue', items.value)
}

function onItemEdit(itemIndex: number, item: IMissionQuoteProduct) {
  items.value.splice(itemIndex, 1, item)
  emit('update:modelValue', items.value)
}
</script>

<style lang="scss" scoped>
.quote-products-input-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.quote-products-input-list {
  h4 {
    font-weight: 600;
  }
  > ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  > h4 {
    margin-bottom: 15px;
  }
}
</style>
