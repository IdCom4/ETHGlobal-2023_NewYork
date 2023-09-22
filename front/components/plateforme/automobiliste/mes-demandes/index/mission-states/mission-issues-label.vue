<template>
  <section class="label-spacing ">
    <h5
      v-for="(issue, index) in props.issues"
      :key="`label-${index}-${Math.random}`"
      class="mission-label"
      :class="{ 'selected-mission': props.isSelected }"
    >
      {{ issue.label }}
    </h5>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  issues: { type: Object as PropType<IIssue[]>, default: null },
  isSelected: { type: Boolean, default: false }
})
</script>
<style scoped lang="scss">
.label-spacing {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.mission-label {
  align-items: center;
  background: #fff;
  border: 1px solid #010101;
  display: flex;
  justify-content: center;
  padding: 2px 12px;
  font-style: italic;

  &.selected-mission {
    background: $color-dark-blue;
    border: 0.3px solid white;
  }
}
</style>
