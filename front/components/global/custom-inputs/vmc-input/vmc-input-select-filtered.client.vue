<template>
  <section class="vmc-input">
    <div class="vmc-input-wrapper">
      <div :class="modalStyle == true ? 'modal-input-wrapper' : `${type} input-wrapper`">
        <div class="container">
          <input
            v-model="searchTerm"
            :class="[modalStyle == true ? 'modal-input input-def' : `${type}-field input-def`]"
            :placeholder="placeholder"
            @input="open = true"
            @blur="closeDropdown"
          />
          <div v-show="open" class="dropdown">
            <div
              v-for="(option, index) in filteredOptions"
              :key="`${String(option.value)}-${index}`"
              class="option"
              @mousedown="selectOption(option.value, option.display)"
            >
              {{ option.display }}
            </div>
          </div>

          <!-- icon if select -->
          <div
            tabindex="0"
            :style="`--right-offset: ${icon ? '30px' : '5px'}`"
            :class="[modalStyle ? `modal-icon` : 'icon', 'icon-select']"
            @keyup.enter="open = true"
            @click="open = !open"
            @blur="closeDropdown"
          >
            <fa :icon="['fas', 'chevron-down']" />
          </div>

          <!-- default label -->
          <label :class="[modalStyle == true ? 'modal-label' : 'label']">{{ label }}</label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String as PropType<INPUT_TYPE>,
    default: 'text',
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  modalStyle: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array<IInputSelectOptions>,
    default: () => []
  },
  initialValue: {
    type: String,
    default: ''
  },
})
const emitEvent = defineEmits(['update:modelValue','optionSelected'])

const open = ref<boolean>(false)
const searchTerm = ref<string>('')

const filteredOptions = computed(() => (
  props.options.filter((option) => option.display.toLowerCase().includes(searchTerm.value.toLowerCase()))
))

const selectOption = (value: unknown, display: string) => {
  searchTerm.value = display
  emitEvent('update:modelValue', value)
  emitEvent('optionSelected', value)
  open.value = false
}

const closeDropdown = () => open.value = false

onMounted(() => {
  searchTerm.value = props.initialValue;
});
</script>

<style scoped lang="scss">
.dropdown {
  position: absolute;
  width: 100%;
  border: 1px solid #ccc;
  z-index: 10;
  top: 30px;
  overflow-y: scroll;
  max-height: 200px;
  transition: max-height 0.3s ease;
}
.option {
  background-color: $white;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
.option:hover {
  background-color: $color-neon-blue;
  font-weight: $font-weight-3;
  transition: background-color 0.3s ease-in-out;
}

.vmc-input {
  position: relative;
  margin: 10px 0;
  padding: 0;
  flex-direction: column;
  align-items: start;

  &-wrapper {
    position: relative;
    width: 100%;
  }
  .input-def {
    outline: none;
    user-select: none;
    border: transparent 1px solid;
    position: relative;
    width: 100%;
  }

  label {
    cursor: pointer;
    white-space: nowrap;
  }

  /* TYPE */
  .select {
    position: relative;
    width: 100%;
    .icon {
      position: absolute;
      margin-top: 15px;
      top: 10px;
      right: 5px;
      border: none;
      background-color: transparent;
      cursor: pointer;

      &-select {
        right: 0;
      }

      .fa-ic {
        padding: 1px 5px;
      }
    }

    /* FIELD */
    .select-field {
      padding: 8px 0 7px 5px;
      margin-top: 15px;
      width: 100%;
      color: $color-dark-blue;
      background: transparent;
      font-family: 'Nunito';
      font-size: 12px;
      font-weight: 400;
      border: solid 2px transparent;
      border-bottom: 1px solid #dcdcdc;
      outline: 0;

      /* reset input */
      &:required,
      &:invalid {
        box-shadow: none;
      }
    }

    /* LABEL */
    .label {
      position: absolute;
      top: 0;
      padding: 0 7px;
      display: block;
    }
  }

  .input-wrapper {
    margin: 0;
    padding: 0;
    position: relative;
  }

  /* in Modal */
  .modal-input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    box-sizing: border-box;

    .modal-input {
      height: 30px;
      padding-left: 15px;
      padding-right: 25px;
      font-family: 'Nunito';
      font-size: 12px;
      border: 1px solid black;

      &::placeholder {
        color: $color-grey;
      }
    }

    .modal-label {
      position: absolute;
      top: -25%;
      width: fit-content;
      padding: 0 6px;
      margin-left: 10px;
      font-family: 'Nunito';
      font-size: 14px;
      background-color: #fff;
    }

    .modal-icon {
      position: absolute;
      top: 7px;
      right: 10px;
      border: none;
      background-color: transparent;
      cursor: pointer;
    }
  }

  span.placeholder {
    position: absolute;
    top: -20px;
  }

  .editable-text-container + .modal-label {
    top: -5px;
  }

  span.placeholder {
    position: absolute;
    top: 9px;
    left: 7px;
    z-index: -5;
  }

  /* Select field */
  .select-field {
    cursor: pointer;
    &:disabled {
      background-color: #ffff;
      cursor: default !important;

      & ~ label {
        top: -15px;
      }

      & ~ .icon {
        top: 3px;
        right: 10px;
      }
    }
  }

  .input-def {
    &.icon-input {
      padding-right: 30px;
    }
    &.input-unit {
      padding-right: 25px;
      &.icon-input {
        padding-right: 55px;
      }
    }
  }
  $type-classes: text, password, email, date, number, address, tel, select, url, time, select;

  @each $type in $type-classes {
    .unit.#{$type}-unit {
      position: absolute;
      right: 0;
      bottom: 8px;
      &.icon-input {
        right: 28px;
      }
    }
  }
  .unit.number-unit.icon-input {
    right: 28px;
  }

  .modal-icon.number-field {
    right: 5px;
  }

  input[type='select'] {
    cursor: default !important;
  }
  .select-field + div.icon-select {
    cursor: pointer !important;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .select-field + .icon {
    cursor: default !important;
  }

  .icon.icon-select {
    position: absolute;

    top: unset !important;
    bottom: 8px !important;
    right: var(--right-offset) !important;
  }
}

.left {
  left: -2px;
}

.right {
  left: calc(50% - 2px);
}

.vmc-input-wrapper {
  position: relative;
}
</style>
