<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="props.isOpen" ref="modalMask" class="modal-mask" :style="`--max-width: ${maxWidth}`" @mousedown="closeModalOutside">
        <div class="modal-wrapper" @mousedown.stop>
          <div class="modal-container">
            <button class="modal-close-button" @click="closeModal"><fa :icon="['far', 'circle-xmark']" /></button>
            <div class="modal-content">
              <div class="container-mobile__pictures">
                <div class="nav-button left" @click="prevPhoto">
                  <fa :icon="['fas', 'chevron-left']" />
                </div>
                <img class="image" :src="currentPhoto?.fileURL" alt="Photos de la réalisation" />

                <div class="nav-button right" @click="nextPhoto">
                  <fa :icon="['fas', 'chevron-right']" />
                </div>
              </div>
              <div class="containerPicture">
                <p class="containerPicture__pagination">
                  {{ currentIndex + 1 }} <span class="containerPicture__pagination--separator"></span> {{ photos.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const emitEvent = defineEmits(['close'])
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  photos: {
    type: Array<IPublicFile>,
    default: null
  },
  index: {
    type: Number,
    default: 0
  },
  maxWidth: {
    type: String,
    default: '90%'
  }
})

const currentIndex = ref<number>(props.index)
const modalMask = ref<HTMLElement | null>(null)
const currentPhoto = computed(() => {
  if (props.photos && props.photos.length > 0) {
    return props.photos[currentIndex.value]
  }
  return null
})

const closeModal = () => {
  emitEvent('close')
}

const closeModalOutside = (event: MouseEvent) => {
  const container = modalMask.value?.querySelector('.modal-container')
  if (container && !container.contains(event.target as Node)) {
    closeModal()
  }
}

watch(
  () => props.index,
  (newValue) => {
    currentIndex.value = newValue
  },
  { immediate: true }
)

const nextPhoto = () => {
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

const prevPhoto = () => {
  currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : props.photos.length - 1
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  background-color: #fff;
  padding: 20px;
  max-width: var(--max-width);
  width: 90%;
  max-height: 95%;
  position: relative;
  border: 1px solid #dcdcdc;
  box-shadow: 10px 10px 8px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.confirmationStyle {
  width: auto;
}
.modal-close-button {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 20px;
  margin: 5px 6px;
}

.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  margin: 20px 0;
  padding: 5px;

  // .carousel {
  //   width: 50px;
  // }
}
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-wrapper,
.modal-leave-to .modal-wrapper,
.modal-enter-from .vmc-input,
.modal-leave-to .vmc-input {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

h5 {
  font-style: normal;
  font-weight: $font-weight-1;
  font-size: $font-size-3;
  line-height: 14px;
  text-transform: none;
  margin-bottom: $spacing-4;
  padding-right: 25px;
}

.containerPicture {
  &__flex {
    display: flex;
    overflow: hidden;
    gap: $spacing-3;
  }
  &__loop {
    &--picture {
      object-fit: cover;
      object-position: center;
      height: 150px;
      width: auto;
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $black;
    margin: 10px;
    font-size: 16px;
    font-weight: 700;
    user-select: none;
    &--separator {
      display: inline-block;
      height: 1px;
      width: 35px;
      margin: 0 5px;
      background-color: $black;
    }
  }
}

.container-mobile__pictures {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  user-select: none;

  .image {
    height: auto;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    max-height: 70vh;
  }

  .nav-button {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 24px;
  }

  .nav-button.left {
    left: 0;
  }

  .nav-button.right {
    right: 0;
  }
}
</style>
