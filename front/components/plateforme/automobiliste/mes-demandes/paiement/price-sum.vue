<template>
  <div class="flex-item">
    <h4>{{ props.text }}</h4>
    <p class="largest">{{ useEuroUnit(props.price) }}</p>
  </div>
</template>
<script setup lang="ts">
type TPriceItemType = 'grey' | 'dark' | 'borderless'

const props = defineProps({
  price: {
    type: Number,
    default: 0
  },
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<TPriceItemType>,
    default: 'grey'
  }
})
</script>
<style lang="scss" scoped>
.flex-item {
  background-color: $color-dark-blue;
  color: $white;
  display: flex;
  justify-content: space-between;

  > p {
    color: $color-neon-blue;
  }
}
</style>
