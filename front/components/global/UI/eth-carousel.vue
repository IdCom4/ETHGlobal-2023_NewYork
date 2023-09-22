<template>
  <section :id="`vmc-carousel-${id}`" class="vmc-carousel">
    <div
      :id="`slider-${id}`"
      class="slider"
      :class="{ grabbing: isDragging, grab: !isDragging }"
      :style="`--offset: -${offset}px; --image-gap: ${imageGap}px`"
    >
      <div v-for="(image, index) in images" :id="`${id}-${index}`" :key="image" class="container">
        <img
          :src="image"
          :class="{ grabbing: isDragging }"
          :alt="`${description} ${index}`"
          @touchend="selectImage(index)"
          @click="selectImage(index)"
          @load="amountOfLoadedImages++"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HTMLEventTypes } from '@/assets/ts/enums'


const emits = defineEmits(['clicked', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  images: {
    type: Array<string>,
    default: [],
    required: true
  },
  description: {
    type: String,
    default: "carrousel d'image"
  },
  autoSlideSpeed: {
    type: Number,
    default: 3000
  },
  noAutoSlide: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: false
  },
  noSnap: {
    type: Boolean,
    defaut : false
  }
})

const id: string = Math.random().toString().replace('.', '-')
const currentIndex = ref<number>(props.modelValue)
const offset = ref<number>(0)
const imageGap = ref<number>(10)
const imageOffsets = ref<Array<number>>([])
const amountOfLoadedImages = ref<number>(0)
const isDragging = ref<boolean>(false)

let maxOffset = 0
let slideInterval = 0
let bufferTimeout = 0
let slidingWay: 'forward' | 'backward' = 'forward'

const dragData = {
  initalPosition: 0,
  currentPosition: 0,
  endPosition: 0
}

/* ==== SLIDING ==== */

function next() {
 goTo((currentIndex.value + 1) % props.images.length)
}

function previous() {
  goTo(currentIndex.value > 0 ? currentIndex.value - 1 : props.images.length - 1);
}

function slide() {
  const isAtMin = currentIndex.value === 0
  const isAtMax = currentIndex.value === props.images.length - 1

  if (isAtMax && slidingWay === 'forward') slidingWay = 'backward'
  if (isAtMin && slidingWay === 'backward') slidingWay = 'forward'

  if (slidingWay === 'forward') next()
  else previous()
}

function goTo(targetIndex: number) {
  const clampedTargetOffset = targetIndex > 0 ? targetIndex < props.images.length ? targetIndex : props.images.length - 1 : 0
  let localOffset = 0

  // get total offset required for the target picture
  for (let index = 0; index < clampedTargetOffset; index++) {
    if (!imageOffsets.value[index]) imageOffsets.value[index] = document.getElementById(`${id}-${index}`)?.offsetWidth || 0

    localOffset += imageOffsets.value[index]
  }

  // set related values
  if (localOffset >= maxOffset) {
    if (slidingWay === 'forward') {
      currentIndex.value = props.images.length - 1
      offset.value = maxOffset
    }
    if (slidingWay === 'backward') {
      currentIndex.value = findClosestIndexFromOffset(maxOffset - 1)
      offset.value = getIndexTotalOffset(currentIndex.value)
    }
  } else {
    currentIndex.value = clampedTargetOffset
    offset.value = localOffset + clampedTargetOffset * imageGap.value
  }

  emits('update:modelValue', currentIndex.value)
}

/* ==== DRAG HANDLING ==== */

function startDrag(originEvent: Event) {
  originEvent.preventDefault();

  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = 0
  }

  isDragging.value = true;
  dragData.initalPosition = getNewPositionFromEvent(originEvent)
  dragData.currentPosition = dragData.initalPosition

  // handle mouse drag
  window.addEventListener('mousemove', dragToNewPosition);
  window.addEventListener('mouseup', stopDrag);

  // hande tactile drag
  window.addEventListener('touchmove', dragToNewPosition);
  window.addEventListener('touchend', stopDrag);
}

function dragToNewPosition(originEvent: Event) {
  // set a litte buffer to prevent this code to run too often and thus start lagging
  if (bufferTimeout) return
  else bufferTimeout = window.setTimeout(() => bufferTimeout = 0, 75)

  const newPosition = getNewPositionFromEvent(originEvent)

  const offset = dragData.currentPosition - newPosition;
  dragData.currentPosition = newPosition

  scrollBy(offset)
}

function stopDrag(event: Event) {
  event.preventDefault()

  dragData.endPosition = dragData.currentPosition

  slidingWay = dragData.endPosition < dragData.initalPosition ? 'forward' : 'backward'

  isDragging.value = false

  // remove event listeners
  window.removeEventListener('mousemove', dragToNewPosition);
  window.removeEventListener('mouseup', stopDrag);

  window.removeEventListener('touchmove', dragToNewPosition);
  window.removeEventListener('touchend', stopDrag);

  // recalibrate offset to the nearest picture
  if(!props.noSnap) goTo(findClosestIndexFromOffset(offset.value))
  else currentIndex.value = findClosestIndexFromOffset(offset.value)

}

function scrollBy(targetOffset: number) {
  const newCurrentOffset = offset.value + targetOffset

  const clampedOffset = newCurrentOffset > 0 ? newCurrentOffset < maxOffset ? newCurrentOffset : maxOffset : 0
  offset.value = clampedOffset
}

function getNewPositionFromEvent(event: Event): number {
  const eventType = event.type as HTMLEventTypes

  const mouseEvents = [HTMLEventTypes.MOUSEDOWN, HTMLEventTypes.MOUSEMOVE, HTMLEventTypes.MOUSEUP]
  const touchEvents = [HTMLEventTypes.TOUCHSTART, HTMLEventTypes.TOUCHMOVE]

  if (mouseEvents.includes(eventType)) return (event as MouseEvent).pageX
  if (touchEvents.includes(eventType)) return (event as TouchEvent).touches[0].clientX

  return 0
}

/* ==== OFFSETS & INDEXES COMPUTATIONS ==== */

function findClosestIndexFromOffset(offset: number): number {
  let summedOffset = 0
  const isAtMaxOffset = offset >= maxOffset

  for (let index = 0; index < props.images.length; index++) {
    const nextImageOffset = index <= props.images.length - 1 ? imageOffsets.value[index] : 0
    const isBetweenPictures = summedOffset <= offset && summedOffset + nextImageOffset >= offset

    // if offset is inside a picture offset but not at max offset
    if (isBetweenPictures && !isAtMaxOffset) return slidingWay === 'forward' ? index + 1 : index
    // else if at max offset
    else if (isAtMaxOffset) return props.images.length - 1

    summedOffset += imageOffsets.value[index]
  }

  return props.images.length - 1
}

function getIndexTotalOffset(targetIndex: number): number {
  if (targetIndex <= 0) return 0
  if (targetIndex >= props.images.length - 1) return maxOffset

  let summedOffset = 0
  for (let index = 0; index < targetIndex; index++) summedOffset += imageOffsets.value[index]

  return summedOffset > maxOffset ? maxOffset : summedOffset
}

function setSizesAndOffset () {
  const sliderWidth = document.getElementById(`slider-${id}`)?.offsetWidth || 0
  const carouselWidth = document.getElementById(`vmc-carousel-${id}`)?.clientWidth || 0
  maxOffset = (sliderWidth ) - carouselWidth

  for (let index = 0; index < props.images.length; index++) imageOffsets.value[index] = document.getElementById(`${id}-${index}`)?.offsetWidth || 0

}

function selectImage(index: number) {
  // check that the event triggering this function is not a drag operation
  if (dragData.initalPosition === dragData.currentPosition) emits('clicked', index)
}

/* ==== MOUNT & WATCHERS SETUP === */

// Ajout des écouteurs d'événements lors du montage du composant
onMounted(() => {
  if (!props.noAutoSlide) slideInterval = window.setInterval(slide, props.autoSlideSpeed)

  // setup drag events
  if (props.draggable) {
    const sliderElement = document.getElementById(`slider-${id}`);
    if (sliderElement) {
      sliderElement.addEventListener('touchstart', startDrag);
      sliderElement.addEventListener('mousedown', startDrag)
    }
  }

  // setup resize event
  document.addEventListener('resize', setSizesAndOffset)
})

// Nettoyage lors de la destruction du composant
onBeforeUnmount(() => {
  if (props.draggable) {
    const sliderElement = document.getElementById(`slider-${id}`);
    if (sliderElement) {
      sliderElement.removeEventListener('touchstart', startDrag);
      sliderElement.removeEventListener('mousedown', startDrag)
    }
  }

  document.removeEventListener('resize', setSizesAndOffset)
})

// watch amout of loaded images to do operations only when they all are loaded
watch(amountOfLoadedImages, () => {
  if (amountOfLoadedImages.value === props.images.length) {
    setSizesAndOffset()
    goTo(currentIndex.value)
  }
})

// watch index from the parent to shift image
watch(() => props.modelValue, (newIndex: number) => goTo(newIndex))

watch(() => document.getElementById(`vmc-carousel-${id}`)?.clientHeight, setSizesAndOffset)
</script>

<style lang="scss" scoped>
.vmc-carousel {
  width: 100%;
  position: relative;
  height: 150px;
  overflow: hidden;
  .slider {
    height: 100%;
    position: absolute;
    top: 0;
    left: var(--offset);
    display: flex;
    // gap: var(--image-gap);
    transition: 0.2s;

    .container {
      height: 100%;
      position: relative;
      & + .container {
        padding-left: var(--image-gap);
      }

      img {
        height: 100%;
        // cursor: pointer;
        // &.grabbing {
        //   cursor: grabbing;
        // }
      }
    }

    &.grab {
      cursor: grab;
    }

    &.grabbing {
      cursor: grabbing;
    }
  }
}
</style>
