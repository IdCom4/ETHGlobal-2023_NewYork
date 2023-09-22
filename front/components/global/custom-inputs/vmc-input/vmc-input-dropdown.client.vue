<template>
  <ul
    :id="`${id}-dropdown`"
    ref="dropdownElement"
    tabindex="0"
    class="vmc-input-dropdown ul-select"
    :class="{
      'modal-style': modal,
      relative: !isAbsolute,
      'go-top': isAbsolute && goTop
    }"
    @focus="currentOptionIndex = options.length ? 0 : null"
  >
    <li
      v-for="(option, index) in options"
      :id="`${id}_option_${index}`"
      :key="`${id}_option-${index}`"
      class="li-option"
      :class="{ selected: currentOptionIndex === index, disabled: option.state === SelectOptionStates.DISABLED }"
      @click="selectOption(option)"
    >
      {{ option.display }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { KeyNames, SelectOptionStates } from '@/types/constants'

const emits = defineEmits(['select'])

const props = defineProps({
  options: {
    type: Array<IInputSelectOptions>,
    default: () => []
  },
  id: {
    type: String,
    default: ''
  },
  focusEnable: {
    type: Boolean,
    default: false
  },
  inputWidthProp: {
    type: String,
    default: "",
  },
  modal: {
    type: Boolean,
    default: false,
  },
  isAbsolute: {
    type: Boolean,
    default: true,
  }
})

const currentOptionIndex = ref<number | null>(null)

/* HANDLE KEYBOARD */
const keyboardNavigation = (e: KeyboardEvent) => {
  // set up allowed keys
  const selectionKeys: string[] = [KeyNames.ARROW_UP, KeyNames.ARROW_DOWN, KeyNames.ENTER]
  // and check if current event is allowed so
  if (!selectionKeys.includes(e.key)) return

  // fetch options HTML elements
  const liHtmlElements = Array.from(document.querySelectorAll('.li-option')) as HTMLLIElement[]
  if (!liHtmlElements) return

  // stop event propagation
  e.preventDefault()

  // if its the first key pressed, init key navigation interface
  if (currentOptionIndex.value === null) {currentOptionIndex.value = 0; return}

  // if key is ENTER, validate the selection
  if (e.key === KeyNames.ENTER) {
    const selectedOption = props.options[currentOptionIndex.value]
    if (selectedOption?.state !== SelectOptionStates.DISABLED) emits('select', selectedOption)

    return
  }

  // else it is a navigation key
  /* eslint-disable prettier/prettier */
  else {

    const loopWhenReach =    e.key === KeyNames.ARROW_UP ? 0 : props.options.length - 1
    const goToWhenLooping =  e.key === KeyNames.ARROW_UP ? props.options.length - 1 : 0
    const indexIncrement =   e.key === KeyNames.ARROW_UP ? -1 : 1
    let   newIndex =         currentOptionIndex.value ? currentOptionIndex.value : 0

    do {
      if (newIndex === loopWhenReach) newIndex = goToWhenLooping
      else newIndex += indexIncrement
    } while (newIndex !== currentOptionIndex.value && props.options[newIndex].state === "disabled");

    currentOptionIndex.value = newIndex
  }
  /* eslint-enable prettier/prettier */
}

function selectOption(option: IInputSelectOptions)
{
  if (option.state === SelectOptionStates.DISABLED) return
  emits('select', option)
}

defineExpose({ keyboardNavigation })

const dropdownElement = ref<HTMLElement | null>(null)
const goTop = ref<boolean>(false)

watch(dropdownElement, () => {
  if (!dropdownElement.value) return

  dropdownElement.value.addEventListener('keydown', keyboardNavigation)

  if (props.focusEnable === true)
    dropdownElement.value.focus()

  // check if dropdown should go top or bottom
  const screenHeight = window.innerHeight || 0
  const dropdownHeight = dropdownElement.value.offsetHeight
  const inputTopPosition = document.getElementById(props.id)?.getBoundingClientRect().top || 0

  goTop.value = inputTopPosition + dropdownHeight + 50 > screenHeight

})

watch(() => props.focusEnable, (newValue) => {
  if (newValue === true)
    dropdownElement.value?.focus()
})
</script>

<style lang="scss" scoped>
.ul-select {
  font-family: 'Nunito';
  outline: 0;
  font-size: 12px;
  font-weight: 400;
  color: $color-dark-blue;
  border-radius: 0 0 2px 2px;
  background-color: rgb(237, 237, 237);
  position: absolute;
  z-index: 99;
  box-sizing: border-box;
  top: 48px;
  width: 100%;
  max-height: 300px;
  overflow: auto;

  &.go-top {
    top: unset !important;
    bottom: 40px !important;
  }

  &.relative {
    top: 0px;
    position: relative;
    max-height: none;
  }

  li {
    cursor: pointer;
    padding: 10px 15px;
    margin: 1px 0;
    transition: 0.2s;

    &:hover {
      background-color: rgba(186, 186, 186, 0.47);
      color: #000000;
    }

    &.disabled {
      background-color: rgb(246, 246, 246);
      color: #8e8e8e;
      cursor: not-allowed;
    }
  }

  .selected {
    background-color: rgba(186, 186, 186, 0.47);
    color: #000000;
  }
}

.modal-style.ul-select {
  &:not(.relative) {
    top: 30px;
  }
}

.icon {
  right: -15px;
}
</style>
