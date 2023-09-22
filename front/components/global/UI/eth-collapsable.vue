<template>
  <div class="vmc-collapsable">
    <!-- CLICKABLE HEADER -->
    <div class="--header" @click="toggleCollapse">
      <slot name="header" :collapsed="isCollapsed">
        <!-- FALLBACK DATA -->
        <div class="--clickable">
          <h4 class="--title">{{ title }}</h4>
          <fa :icon="['fas', 'chevron-right']" class="--icon" :class="{ collapsed: isCollapsed }" :width="17" :height="17" />
        </div>
      </slot>
    </div>

    <!-- COLLAPSABLE CONTENT -->
    <div
      ref="collapsableElement"
      class="--content-wrapper"
      :style="{ transition: `${animationDurationInSec}s ease-in`, maxHeight: `${currentMaxHeight}px`, overflow: overflowState }"
    >
      <div ref="contentElement" class="--content">
        <slot name="content" :collapsed="isCollapsed">
          <!-- FALLBACK DATA -->
          <p>content</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: null },
  locked: { type: Boolean, default: false },
  noDelay: { type: Boolean, default: false }
})

const collapsableElement = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()

// variables for the animation
const baseAnimationDurationInSec = 0.5
const animationDurationInSec = ref<number>(props.noDelay ? 0 : baseAnimationDurationInSec)
const currentMaxHeight = ref<number>(0)
const overflowState = ref<'hidden' | 'visible'>('hidden')

// is the content is collapsed
const isCollapsed = ref<boolean>(props.modelValue)

// is the animation on going
let isAnimationLoading = false
let bufferTimeout = 0
let endOfOpenTimeout = 0

watch(
  () => props.modelValue,
  () => (props.modelValue !== isCollapsed.value ? toggleCollapse() : null)
)
watch(
  () => props.noDelay,
  () => (animationDurationInSec.value = props.noDelay ? 0 : 0.5)
)

// mutation observer useful if slot content's height changes
watch(contentElement, () => {
  nextTick(() => {
    if (!contentElement.value) return

    const observer = new ResizeObserver(() => {
      if (contentElement.value && !isCollapsed.value) openWithBuffer()
    })

    observer.observe(contentElement.value)
  })
})

// is called when the inner content of slot can change in size gradually,
// thus not working properly with the traditional open() function
function openWithBuffer() {
  // those first 2 lines prevent this method from being called to often and to lag
  if (bufferTimeout) return
  bufferTimeout = window.setTimeout(() => (bufferTimeout = 0), 50)

  isAnimationLoading = true
  isCollapsed.value = false
  overflowState.value = 'hidden'

  // gather content height and update maxHeight
  currentMaxHeight.value = contentElement.value ? getElementTotalHeight(contentElement.value) : 2000

  if (endOfOpenTimeout) {
    window.clearTimeout(endOfOpenTimeout)
    endOfOpenTimeout = 0
  }

  endOfOpenTimeout = window.setTimeout(() => {
    overflowState.value = 'visible'
    isAnimationLoading = false

    window.clearTimeout(endOfOpenTimeout)
    endOfOpenTimeout = 0
  }, animationDurationInSec.value * 1000)
}

// is called when the user open a collapsed section
function open() {
  if (contentElement.value) {
    if (isAnimationLoading) return
    isAnimationLoading = true
    isCollapsed.value = false
    overflowState.value = 'hidden'

    // gather content height and update maxHeight
    currentMaxHeight.value = getElementTotalHeight(contentElement.value) || 2000

    // ensure the animation completes, and set overflow to visible
    setTimeout(() => {
      overflowState.value = 'visible'
      isAnimationLoading = false
    }, animationDurationInSec.value * 1000)
  }
}

// is called when the user collapse an opened section
function close() {
  // prevent multiple clicks
  if (isAnimationLoading) return
  isAnimationLoading = true
  isCollapsed.value = true
  animationDurationInSec.value = baseAnimationDurationInSec

  // update overflow and maxHeight values
  overflowState.value = 'hidden'
  currentMaxHeight.value = 0

  // ensure the animation completes
  setTimeout(() => {
    isAnimationLoading = false
    animationDurationInSec.value = props.noDelay ? 0 : baseAnimationDurationInSec
  }, animationDurationInSec.value * 1000)
}

function toggleCollapse() {
  if (props.locked) return

  if (isCollapsed.value) open()
  else close()
}

function getElementTotalHeight(element: HTMLElement): number {
  const height = element.offsetHeight || element.scrollHeight
  const style = getComputedStyle(element)

  return height + parseInt(style.marginTop) + parseInt(style.marginBottom)
}

watch(isCollapsed, () => setTimeout(() => emit('update:modelValue', isCollapsed.value), animationDurationInSec.value))
</script>

<style lang="scss" scoped>
.vmc-collapsable {
  display: flex;
  flex-direction: column;

  .--header {
    .--clickable {
      cursor: pointer;
      display: flex;
      justify-content: space-between;

      .--icon {
        transition: 0.2s ease;
        transform: rotate(90deg);

        &.collapsed {
          transform: rotate(0deg);
        }
      }
    }
  }

  .--content-wrapper {
    overflow: hidden;

    .--content {
      // necessary to make the browser computes total height of the content
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }
}

@media screen and (max-width: 600px) {
  .vmc-collapsable {
    .--header {
      .--title {
        font-size: 13px;
      }
    }
  }
}
</style>
