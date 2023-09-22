<template>
  <section ref="slideContainer" class="slide-container" @scroll="onScroll" @touchstart="stopScrollTimer" @mousedown="onMouseDown">
    <slot v-for="(content, index) in props.contents" class="carousel-slide" name="slide" :data="{ content, index, slideIndex }"></slot>
  </section>
</template>
<script lang="ts" setup>
const emits = defineEmits(['update:modelValue'])

interface IAutoScrollParameters {
  type: 'slideBySlide' | 'continuous' | 'none'
  delayInMs: number
  scrollSpeed: number
  restartDelay: number
}

const props = defineProps({
  contents: {
    type: Array as PropType<Array<unknown>>,
    default: () => [],
    required: true
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  autoScroll: {
    type: Object as PropType<IAutoScrollParameters>,
    default: () => ({
      type: 'none',
      delayInMs: 1000,
      scrollSpeed: 15,
      restartDelay: 3000
    })
  },
  wrapInfinite: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: 0
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

const slideContainer = ref<HTMLElement>()
const slides = ref<HTMLElement[]>()
const slideIndex = ref<number>(props.modelValue)
const autoScrollEnabled = ref<boolean>(false)
const mouseCoordinate = ref({ x: 0, y: 0 })

let autoScrollTimerId: NodeJS.Timer

const scrollThresholds = computed<Array<number>>(() => {
  if (!slides.value || !slideContainer.value) return []

  const viewPortSize = slideContainer.value.getBoundingClientRect()
  const totalSlides = slides.value.length

  return slides.value.map((elem, index) => {
    const elemSize = elem.getBoundingClientRect()

    // set slideIndex to 0 when scroll is at 0
    if (index === 0) return 0
    // set slideIndex to max when reaching end of scroll
    else if (index == totalSlides - 1)
      return props.direction == 'horizontal'
        ? elem.offsetLeft - viewPortSize.width + elemSize.width * 0.9
        : elem.offsetTop - viewPortSize.height + elemSize.height * 0.9

    let threshold = 0
    if (props.direction == 'horizontal') {
      threshold = elem.offsetLeft - elemSize.width * 0.3 //little offset to treshold to be more fluid
    } else {
      threshold = elem.offsetTop - elemSize.height * 0.3
    }

    return threshold
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    slideIndex.value = newValue
  }
)

watch(slideIndex, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(
  slideContainer,
  () => {
    if (!slideContainer.value) return
    slides.value = Array.from(slideContainer.value.children) as HTMLElement[]
  },
  { immediate: true }
)

function onScroll(event: Event) {
  const elem = event.target as HTMLElement

  const pixelsScrolled = props.direction == 'horizontal' ? elem.scrollLeft : elem.scrollTop

  for (const thresholdIndex in scrollThresholds.value) {
    const threshold = scrollThresholds.value[thresholdIndex]
    if (pixelsScrolled > threshold) {
      slideIndex.value = Number(thresholdIndex)
    }
  }
}

onMounted(() => {
  setupAutoScrollTimer()
  window.addEventListener('mouseup', setupAutoScrollTimerWithGlobalRestartDelay)
  window.addEventListener('touchend', setupAutoScrollTimerWithGlobalRestartDelay)
})

onBeforeMount(() => {
  window.removeEventListener('mouseup', setupAutoScrollTimerWithGlobalRestartDelay)
  window.removeEventListener('touchend', setupAutoScrollTimerWithGlobalRestartDelay)
})

//######## UserInput Handler

function onMouseDown(event: MouseEvent) {
  stopScrollTimer()
  initDrag(event)
}

//######### AutoScroll ###########

function stopScrollTimer() {
  clearInterval(autoScrollTimerId)
  autoScrollEnabled.value = false
}

function setupAutoScrollTimerWithGlobalRestartDelay() {
  setupAutoScrollTimer(props.autoScroll.restartDelay)
}

async function setupAutoScrollTimer(delay = 0) {
  if (!props.autoScroll) return
  if (autoScrollEnabled.value) return

  await new Promise((resolve) => setTimeout(resolve, delay))

  // TODO: is this line necessary ? its the same as 2 lines above
  if (autoScrollEnabled.value) return

  autoScrollEnabled.value = true
  clearInterval(autoScrollTimerId)

  if (props.autoScroll.type == 'slideBySlide') {
    autoScrollTimerId = setInterval(() => {
      scrollToOffsetIndex(1)
    }, props.autoScroll.delayInMs)
  }

  if (props.autoScroll.type == 'continuous') {
    autoScrollTimerId = setInterval(() => {
      scrollBy(1)
    }, 1000 / props.autoScroll.scrollSpeed)
  }
}

//######### Scroll ###########
function scrollToElemIndex(index: number) {
  if (!slideContainer.value || !slides.value) return
  index = index % slides.value.length
  const slide = slides.value[index]

  slideContainer.value.scrollTo({
    behavior: 'smooth',
    top: slide.offsetTop,
    left: slide.offsetLeft
  })
}

function scrollToOffsetIndex(offset: number) {
  scrollToElemIndex(slideIndex.value + offset)
}

function scrollBy(pixels: number) {
  if (!slideContainer.value) return
  slideContainer.value.scrollBy({
    left: pixels,
    top: pixels,
    // 'instant' property is not always recognized, yet it exists and is supported
    // @ts-ignore
    behavior: 'instant'
  })
}

//#######  Draggable ######

function handleDrag(event: MouseEvent) {
  const offset = props.direction === 'horizontal' ? mouseCoordinate.value.x - event.pageX : mouseCoordinate.value.y - event.pageY

  scrollBy(offset)

  mouseCoordinate.value.x = event.pageX
  mouseCoordinate.value.y = event.pageY
}

function stopDrag() {
  window.removeEventListener('mousemove', handleDrag)
}

function initDrag(initialClickEvent: MouseEvent) {
  if (!props.draggable) return
  mouseCoordinate.value.x = initialClickEvent.clientX
  mouseCoordinate.value.y = initialClickEvent.clientY

  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
}
</script>
<style lang="scss">
.slide-container {
  img {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    cursor: default;
    pointer-events: none;
  }
}
</style>
