<template>
  <div class="focus-layout">
    <vmc-collapsable v-model="collapsed">
      <template #header>
        <div class="focus-header" @click="toggleCollapse">
          <h3 class="--inverted">{{ props.title }}</h3>
          <fa icon="fa-solid fa-chevron-down" class="chevron" :class="{ 'inverted-chevron': collapsed }" />
        </div>
      </template>

      <template #content>
        <div class="content">
          <slot></slot>
        </div>
      </template>
    </vmc-collapsable>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: '' }
})

const collapsed = ref<boolean>(props.modelValue)
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== collapsed.value) collapsed.value = props.modelValue
  }
)

watch(collapsed, () => emit('update:modelValue', collapsed.value))

/* useGlobalEvents().subscribeTo(GlobalEventTypes.MISSION_OPEN_STATE_ACTION, (buttonText: unknown) => {
  const shouldTriggerCollapse = ref(false)
  if (
    buttonText === EMissionButtonText.VALIDATE_MISSION &&
    (props.title === 'Finalisation mission' || props.title === 'En attente de validation')
  )
    shouldTriggerCollapse.value = true
  if (buttonText === EMissionButtonText.VIEW_INVOICE && (props.title === 'Ma facture' || props.title === 'Facture'))
    shouldTriggerCollapse.value = true
  if (buttonText === EMissionButtonText.VIEW_QUOTE && (props.title === 'Devis reçu' || props.title === 'Devis envoyé'))
    shouldTriggerCollapse.value = true
  if (shouldTriggerCollapse.value) {
    emit('close-discussion')
    nextTick(() => {
      if (isCollapsed) open()
    })
  }
}) */
</script>
<style scoped lang="scss">
.focus-layout {
  width: 100%;
  .focus-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    h3 {
      cursor: pointer;
      width: 100%;
      &::after {
        margin-left: 25px;
        background-color: white;
      }
      &::before {
        margin-right: 25px;
        background-color: white;
      }
    }
    .chevron {
      transition: 0.5s ease;
      transform: rotate(0deg);
      cursor: pointer;
      color: white;
      &.inverted-chevron {
        transition: 0.5s ease;
        transform: rotate(-90deg);
      }
    }
  }

  .content {
    padding-top: $spacing-4;
  }
}
</style>
