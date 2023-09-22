<template>
  <section class="autocomplete-input">
    <div class="input-container">
      <!-- SEARCH INPUT -->
      <eth-input
        v-model="search"
        :placeholder="placeholder"
        :label="label"
        type="text"
        :icon="icon"
        :error="error"
        modal-style
        @keydown="handleKeyboardNavigation"
      />

      <!-- RELEVANT OPTIONS DISPLAY -->
      <div
        v-if="relevantOptions.length"
        ref="relevantOptionsElement"
        class="relevant-options"
        :style="`--option-display-limit: ${optionsDisplayLimit}`"
      >
        <p
          v-for="(option, index) in relevantOptions"
          :key="`relevant-options-${index}-${option.display}`"
          class="relevant-option"
          :class="{ hovered: currentRelevantOptionIndex === index }"
          @click="selectOption(option)"
        >
          {{ option.display }}
        </p>
      </div>
    </div>

    <!-- SELECTED OPTIONS DISPLAY -->
    <div
      v-if="selectedDisplayStyle !== SelectedOptionStyles.NONE"
      ref="relevantOptionsElement"
      class="selected-options"
      :class="[`selected-style_${selectedDisplayStyle}`]"
    >
      <p
        v-for="(option, index) in selectedOptions"
        :key="`selected-options-${index}-${option.display}`"
        class="selected-option"
        @click="unselectOption(option)"
      >
        <fa icon="fa-regular fa-circle-xmark" class="icon --close" />
        {{ option.display }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { KeyNames, SelectedOptionStyles } from '@/assets/ts/enums'


const emit = defineEmits(['update:modelValue', 'input'])
/* eslint-disable prettier/prettier */
const props = defineProps({
  modelValue:           { type: [Object, String, Number] as PropType<unknown | Array<unknown>>,                                       required: true  },
  options:              { type: Array<IInputSelectOptions>,                                                                           required: true  },
  label:                { type: String,                                                         default: '',                          required: false },
  placeholder:          { type: String,                                                         default: 'Rechercher',                required: false },
  icon:                 { type: String,                                                         default: '',                          required: false },
  error:                { type: String,                                                         default: '',                          required: false },
  selectedStyle:        { type: String as PropType<SelectedOptionStyles>,                       default: SelectedOptionStyles.CHIP,   required: false },
  optionsRenderLimit:   { type: Number,                                                         default: 50,                          required: false },
  optionsDisplayLimit:  { type: Number,                                                         default: 10,                          required: false },
  storageKey:           { type: String,                                                         default: '',                          required: false }
})
/* eslint-enable prettier/prettier */

const isSingleValue = !Array.isArray(props.modelValue)
const selectedDisplayStyle = ref<SelectedOptionStyles>(isSingleValue ? SelectedOptionStyles.NONE : props.selectedStyle)
const selectedOptions = ref<Array<IInputSelectOptions>>(findOptionsFromDatas(props.modelValue))
const relevantOptions = ref<Array<IInputSelectOptions>>([])
const currentRelevantOptionIndex = ref<number>(0)
const relevantOptionsElement = ref<HTMLElement>()
const search = ref<string>(isSingleValue && selectedOptions.value.length ? selectedOptions.value[0].display : '')

onMounted(() => {
  const dataLoaded = loadSelectedOptionsFromLocalStorage()
  if (dataLoaded) emitUpdatedSelectedOptions()
})

function selectOption(option: IInputSelectOptions): void {
  // add option to selected ones
  if (isSingleValue) selectedOptions.value[0] = option
  else selectedOptions.value.push(option)

  emitUpdatedSelectedOptions()

  // clean previous search artefacts
  search.value = isSingleValue && selectedOptions.value.length ? selectedOptions.value[0].display : ''
  relevantOptions.value.length = 0
}

function unselectOption(option: IInputSelectOptions): void {

  if (isSingleValue) selectedOptions.value.length = 0
  else {
    const optionIndex = selectedOptions.value.findIndex((_option) => _option.display === option.display)
    if (optionIndex < 0) return

    selectedOptions.value.splice(optionIndex, 1)
  }

  emitUpdatedSelectedOptions()
}

function emitUpdatedSelectedOptions(): void {
  // if required save selected options to local storage
  if (props.storageKey) saveSelectedOptionsToLocalStorage()

  // get values from options
  const selectedValues = isSingleValue ? selectedOptions.value[0].value : selectedOptions.value.map((option) => option.value)

  // emit selected values
  emit('update:modelValue', selectedValues)
  emit('input', selectedValues)
}

// load options from the local storage, if any
function loadSelectedOptionsFromLocalStorage(): boolean {
  const storedSelectedOptions = localStorage.getItem(props.storageKey)
  if (!storedSelectedOptions) return false

  selectedOptions.value = JSON.parse(storedSelectedOptions)
  return true
}

// save options to local storage
function saveSelectedOptionsToLocalStorage() {
  if (!props.storageKey) return

  localStorage.setItem(props.storageKey, JSON.stringify(selectedOptions.value))
}

function handleKeyboardNavigation(event: KeyboardEvent): void {
  if (!relevantOptions.value.length) return

  const allowedKeys: string[] = [KeyNames.ARROW_DOWN, KeyNames.ARROW_UP, KeyNames.ENTER]

  if (!allowedKeys.includes(event.key)) return

  event.preventDefault()

  if (event.key === KeyNames.ARROW_DOWN) currentRelevantOptionIndex.value = (currentRelevantOptionIndex.value + 1) % relevantOptions.value.length
  if (event.key === KeyNames.ARROW_UP) currentRelevantOptionIndex.value = currentRelevantOptionIndex.value ? currentRelevantOptionIndex.value - 1 : relevantOptions.value.length - 1
  if (event.key === KeyNames.ENTER) selectOption(relevantOptions.value[currentRelevantOptionIndex.value])
}

// find relevant options on search update
watch(search, () => relevantOptions.value = findRelevantOptions(search.value, props.options))

function findRelevantOptions(search: string, options: IInputSelectOptions[]): Array<IInputSelectOptions> {
  const formattedSearch = search.toLowerCase().trim()
  const isSingleValueAndSearchTheAlreadySelectedOption = isSingleValue && selectedOptions.value.length && formattedSearch === selectedOptions.value[0].display.toLocaleLowerCase()

  if (!formattedSearch || isSingleValueAndSearchTheAlreadySelectedOption) return []


  // find options that contains search
  const allRelevantOptions = options.filter((option) => option.display.toLowerCase().includes(formattedSearch))

  // remove options that are already selected,
  // except is single value is on, in which case selection will only be overridden by itself
  const prunedRelevantOptions = isSingleValue ? allRelevantOptions : allRelevantOptions.filter((option) => !selectedOptions.value.find((selectedOption) => selectedOption.display === option.display))

  // keep only the first {{ limit }} for rendering performance
  if (prunedRelevantOptions.length > props.optionsRenderLimit) prunedRelevantOptions.length = props.optionsRenderLimit

  // rebound index
  currentRelevantOptionIndex.value = 0

  return prunedRelevantOptions
}

// find options related to given values
function findOptionsFromDatas(value: unknown | unknown[]): Array<IInputSelectOptions> {
  let options: IInputSelectOptions[]
  // if value is an array, find all options related to its entries
  if (Array.isArray(value)) {
    const stringifiedValues = value.map((entry) => JSON.stringify(entry))
    options = props.options.filter((option) => stringifiedValues.find((strValue) => strValue == JSON.stringify(option.value)))
  }
  // else find the only option that can be related to its value
  else {
    const strValue = JSON.stringify(value)
    options = [props.options.find((option) => strValue === JSON.stringify(option.value))].filter((option): option is NonNullable<IInputSelectOptions> => !!option)
  }

  return options
}

// update selected options on modelValue update
watch(() => props.modelValue, () => (selectedOptions.value = findOptionsFromDatas(props.modelValue)), { immediate: true })

// To close relevant options list, the only way that works
document.addEventListener('click', (event: Event) => {
  if (!relevantOptionsElement.value?.contains(event.target as HTMLElement)) relevantOptions.value.length = 0
})
</script>

<style lang="scss" scoped>
.autocomplete-input {
  width: 100%;

  .input-container {
    position: relative;
    .relevant-options {
      $option-height: 12px;
      $option-vertical-padding: 10px;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      width: 100%;
      max-height: calc(($option-height + $option-vertical-padding * 2) * var(--option-display-limit));
      overflow-y: scroll;
      background-color: $color-light-grey;

      .relevant-option {
        width: 100%;
        min-height: $option-height;
        padding: $option-vertical-padding 15px;
        cursor: pointer;

        &:hover,
        &.hovered {
          background-color: #c9c9c9;
        }
      }
    }
  }

  .selected-options {
    display: flex;

    .selected-option {
      display: flex;
      padding: 5px;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .icon.--close {
        height: 12px;
        width: 12px;
      }

      &:hover {
        cursor: pointer;
        background-color: $color-light-grey !important;
        .icon.--close {
          color: $color-error;
        }
      }
    }

    // optional styles
    &.selected-style_chip {
      gap: 5px;
      flex-wrap: wrap;

      .selected-option {
        border-radius: 2px;
        background-color: #c9c9c9;
        flex-direction: row-reverse;
      }
    }

    &.selected-style_list {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>
