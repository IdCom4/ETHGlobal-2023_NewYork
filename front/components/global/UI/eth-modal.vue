<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" ref="modalMask" class="modal-mask" :style="`--max-width: ${maxWidth}; --height: ${height}`" @mousedown="closeModalOutside">
        <div :class="['modal-wrapper', confirmationStyle ? 'confirmationStyle' : '']" @mousedown.stop>
          <div class="modal-container">
            <h5>{{ title }}</h5>
            <button class="modal-close-button" @click="closeModal"><fa :icon="['far', 'circle-xmark']" /></button>
            <div class="modal-content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  confirmationStyle: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: '90%'
  },
  height: {
    type: String,
    default: 'fit-content'
  },
  id: {
    type: String,
    default: null
  }
})

const modalMask = ref<HTMLElement | null>(null)
const emitEvent = defineEmits(['close'])

const closeModal = () => {
  emitEvent('close')
}

const closeModalOutside = (event: MouseEvent) => {
  const container = modalMask.value?.querySelector('.modal-container')
  if (container && !container.contains(event.target as Node)) {
    closeModal()
  }
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
  height: var(--height);
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
</style>
