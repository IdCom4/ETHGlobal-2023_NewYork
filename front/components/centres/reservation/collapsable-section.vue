<template>
  <section class="collapsable-section">
    <div class="collapsable-header" @click="isCollapsed = !isCollapsed">
      <h4 class="collapsable-title">{{ title }}</h4>
      <fa :icon="['fas', 'chevron-right']" :class="{ collapsed: isCollapsed }" :width="17" :height="17" />
    </div>
    <p
      ref="contentSection"
      :style="{ maxHeight: `${isCollapsed ? 0 : contentSection?.scrollHeight}px` }"
      class="largest"
      :class="{ collapsed: isCollapsed }"
    >
      <slot></slot>
    </p>
  </section>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: null
  }
})

const contentSection = ref<HTMLElement>()
const isCollapsed = ref<boolean>(true)
const maxHeight = ref<number>(999)

onMounted(() => {
  if (!contentSection.value) return
  maxHeight.value = contentSection.value.scrollHeight
})
</script>
<style scoped lang="scss">
.collapsable-section {
  border-bottom: 1px solid #000000;
  padding: 28px 0px;
  display: flex;
  flex-direction: column;

  > .collapsable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    > .collapsable-title {
      font-size: 15px;
      line-height: 30px;
    }
  }
}

svg {
  transition: 0.2s ease;
  transform: rotate(90deg);

  &.collapsed {
    transform: rotate(0deg);
  }
}

p {
  overflow: hidden;
  transition: 0.2s ease;
  margin-top: 25px;
  max-height: 999px;
  &.collapsed {
    margin-top: 0px;
    max-height: 0px;
  }
}

@media screen and (max-width: 600px) {
  .collapsable-section {
    > .collapsable-header {
      > .collapsable-title {
        font-size: 13px;
      }
    }
  }
}
</style>
