<template>
  <section :id="`section-${id}`" class="eth-input" :class="[customTheme]">
    <div class="eth-input-wrapper" @focusout="dispatchBlurEvent">
      <!-- type textarea -->
      <div v-if="type === InputTypes.TEXTAREA" :class="[modalStyle == true ? 'modal-input-wrapper' : 'input-wrapper-textaera', customTheme]">
        <p class="editable-text-container">
          <span
            :id="id"
            ref="textareaEditableRef"
            :class="[{ disabled: disabled }, error ? 'error' : '', 'input-def', 'textarea', modalStyle == true ? 'textarea-modal' : '']"
            role="textbox"
            :contenteditable="!disabled"
            :disabled="disabled"
            :error="!!error"
            :name="name"
            :modalStyle="true"
            @change="$emit('change')"
            @input="dispatchValueUpdateHandling"
          >
          </span>
          <span v-if="!inputCurrentTextualValue && placeholder" class="placeholder" :class="[customTheme]"
            >{{ placeholder }}{{ inputCurrentTextualValue }}</span
          >
        </p>

        <!-- default label -->
        <label
          :for="id"
          :class="[
            type === InputTypes.TEXTAREA && modalStyle === false ? 'label-textarea' : '',
            modalStyle === true ? 'modal-label' : 'label',
            { disabled: disabled }
          ]"
          :style="modalStyle && backgroundColor ? '--bg: ' + backgroundColor : ''"
        >
          {{ label }}
        </label>
      </div>
      <!-- all input types other than toggle -->
      <div
        v-if="type !== InputTypes.TEXTAREA && type !== InputTypes.TOGGLE"
        :class="modalStyle == true ? 'modal-input-wrapper' : `${type} input-wrapper`"
        onfocus="(this.type='date')"
        onblur="if(!this.value)this.type='text'"
      >
        <div class="container" @click="dispatchInputWrapperClickEvent">
          <!-- <div id="modal-icon" ref="modal-icon" class="test" @click="toggleOptions = !toggleOptions"></div> -->
          <input
            :id="id"
            :value="inputCurrentTextualValue"
            :class="[modalStyle == true ? 'modal-input input-def' : `${type}-field input-def`, unit ? 'input-unit' : '', icon ? 'icon-input' : '']"
            :type="type"
            :disabled="disabled || (type === InputTypes.SELECT && !filterable)"
            :required="required"
            :placeholder="placeholder"
            :error="!!error"
            :name="name"
            :min="updatableMin"
            :max="updatableMax"
            :checked="isChecked"
            :step="step"
            :errorGrow="errorGrow"
            :readonly="readonly"
            @input="dispatchValueUpdateHandling"
            @change="$emit('change')"
            @keydown="dispatchKeydownEvent"
            @keyup.enter="dispatchKeydownEnter"
          />

          <!-- icon if select -->
          <div
            v-if="type === InputTypes.SELECT"
            :id="id + '-modal-icon'"
            ref="modal-icon"
            tabindex="0"
            :style="`--right-offset: ${icon ? '30px' : '5px'}`"
            :class="[modalStyle ? `modal-icon` : 'icon', 'icon-select', icon ? 'icon' : '']"
            @keyup.enter="openDropdown(true)"
            @click="openDropdown(true)"
          >
            <fa v-if="!filterable" :icon="['fas', 'chevron-down']" />
            <fa v-else :icon="['fa-solid', 'fa-magnifying-glass']" />
          </div>
          <!-- unit if any -->
          <span v-if="unit" :class="['unit', `${type}-unit`, icon ? 'icon-input' : '']">{{ unit }}</span>
        </div>

        <!-- icon if any -->
        <div
          v-if="icon"
          :id="id + '-modal-icon'"
          ref="modal-icon"
          :class="[modalStyle ? `modal-icon` : 'icon', `${type}-icon`]"
          @click="$emit('iconClick')"
        >
          <fa :icon="icon" />
        </div>

        <!-- default label -->
        <label
          :for="id"
          :class="[modalStyle == true ? 'modal-label' : 'label', { disabled: disabled }]"
          :style="modalStyle && backgroundColor ? '--bg: ' + backgroundColor : ''"
        >
          {{ label }}
        </label>
        <slot />
      </div>

      <div v-if="type === InputTypes.TOGGLE" class="activeToggle" :class="isChecked ? 'left' : 'right'"></div>

      <!-- error if any -->
      <small v-if="error" :class="type + '-error'">{{ error }}</small>
      <small v-else-if="props.errorGrow" class="no-error"></small>

      <!-- type toggle -->
      <label
        v-if="type === InputTypes.TOGGLE"
        :for="`${id}_toggle`"
        :value="inputCurrentTextualValue"
        :class="{
          'is-checked': isChecked,
          'is-not-checked': !isChecked,
          disabled: disabled
        }"
        @click="
          (event: Event) => {
            if (disabled) event.preventDefault()
          }
        "
      >
        <input :id="`${id}_toggle`" type="checkbox" @input="dispatchValueUpdateHandling" />
        <span class="text text--yes" tabindex="0" @keyup.enter="dispatchKeydownEnter">Oui</span>
        <span class="text text--no" tabindex="0" @keyup.enter="dispatchKeydownEnter">Non</span>
      </label>

      <!-- if input type is select && on responsive -->
      <eth-modal
        v-if="screenWidth < 1220 && type === InputTypes.SELECT && !filterable && !notModal"
        :id="`${id}_vmc-modale`"
        :is-open="toggleOptions && !!updatableSelectOptions.length"
        :title="label"
        @close="toggleOptions = false"
      >
        <eth-input-dropdown
          :id="id"
          :is-absolute="false"
          :options="updatableSelectOptions"
          :modal="modalStyle"
          :focus-enable="focusDropdown"
          @select="emitSelectedOption"
        />
      </eth-modal>
      <!-- else -->
      <eth-input-dropdown
        v-else-if="toggleOptions && !!updatableSelectOptions.length"
        :id="id"
        :options="updatableSelectOptions"
        :modal="modalStyle"
        :focus-enable="focusDropdown"
        go-top
        @select="emitSelectedOption"
        @blur="toggleOptions = false"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUtils } from '@/composables/useUtils'
import { InputTypes, SelectOptionStates, KeyNames } from '@/assets/ts/enums'

/**TSDoc
 * @property { String } type - Le type d'input. Par défaut : 'text'
 * @property { String } placeholder - Le texte d'aide dans l'input. Par défaut : ''
 * @property { String } id - L'ID de l'input. Par défaut : une valeur générée aléatoirement
 * @property { String } label - Le label de l'input. Par défaut : ''
 * @property { String } name - Le name de l'input. Par défaut : ''
 * @property { Boolean } filterable - Si l'input est filtrable ou non. Par défaut : false
 * @property { Boolean } modalStyle - Si l'input est dans une modal ou non, pour appliquer le style correspondant. Par défaut : false
 * @property { Boolean } required - Si l'input est requis ou non. Par défaut : false
 * @property { Boolean } disabled - Si l'input est désactivé ou non. Par défaut : false
 * @property { Boolean } readonly - Si l'input peut être modifié par l'utilisateur. Par défaut : false
 * @property { String|null } unit - L'unité de mesure pour l'input. Par défaut : null
 * @property { String|Array|null } icon - L'icône pour l'input. Par défaut : null
 * @property { String|Number|Boolean|Object|null } modelValue - La valeur de l'input. Par défaut : null
 * @property { String } error - Le message d'erreur pour l'input. Par défaut : ''
 */

/* SETTINGS */
const emitEvent = defineEmits(['iconClick', 'update:modelValue', 'change', 'input', 'blur'])

const props = defineProps({
  /* Require */
  type: {
    type: String as PropType<InputTypes>,
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

  /* Modal */
  modalStyle: {
    type: Boolean,
    default: false
  },

  /* Optional */
  id: {
    type: String,
    default: () => `eth-input_id-${Math.random().toString().replace('.', '-')}`
  },
  name: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  notModal: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  filterable : {
    type: Boolean,
    default: false
  },
  unit: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean, Object, null] as PropType<string | number | boolean | object | null>,
    default: null
  },
  icon: {
    type: [Array, String],
    default: null
  },
  min: {
    type: [String, Number] as PropType<string | number>,
    default: ""
  },
  max: {
    type: [String, Number] as PropType<string | number>,
    default: ""
  },
  step: {
    type: [String, Number],
    default: 1
  },
  errorGrow: {
    type: Boolean,
    default: false
  },
  /* SELECT SPECIFIC */
  selectOptions: {
    type: Array<IInputSelectOptions>,
    default: () => []
  },
  /* ERROR */
  error: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'white'
  },
  backgroundColor: {
    type: String,
    default: ''
  }
})


/* >=========== COMMON VARIABLES */
const inputCurrentTextualValue = ref<string | number>()
const updatableMin = ref<string | number>()
const updatableMax = ref<string | number>()
const errorGrow = ref<boolean>()
const screenWidth = ref<number>(0)
const screenHeight = ref<number>(0)
let debounce = false
const themeClassMap = ref<Record<string,string>>( {
  white: 'white-theme',
  dark: 'dark-theme',
  grey: 'grey-theme'
})
const customTheme = ref<string>('white-theme')


const isChecked = ref(false)
const keydownEvent = ref<KeyboardEvent>()

/* >=========== SELECT TYPE VARIABLES */
// if input type is address, option are open by default, else not
const toggleOptions = ref<boolean>(props.type === InputTypes.ADDRESS)
const focusDropdown = ref<boolean>(false)
const updatableSelectOptions = ref<IInputSelectOptions[]>([])

/* >=========== TEXTAREA TYPE VARIABLES */
const textareaEditableRef = ref<HTMLElement | null>(null)

// try to transform the eth-input value to a string so that it can be shown to the user in a readable format
const getValueAsPrintableString = (value: unknown): string => {
  const Types = useUtils().types

  if (props.type === InputTypes.SELECT) return updatableSelectOptions.value.find((option) => JSON.stringify(option.value) === JSON.stringify(value))?.display || ''
  else if (props.type === InputTypes.DATE && Types.isString(value)) return useUtils().dates.formatStrDate(value, "dd/MM/yyyy", "yyyy-MM-dd") || ''
  else if (Types.isNumber(value)) return `${value}`
  else if (Types.isString(value)) return value
  else if (Types.isBoolean(value)) return value ? 'oui' : 'non'

  return ''
}

/* >=========== PREVENT NON NUMERIC INPUT FOR NUMBER */
const preventNonNumeric = (event: KeyboardEvent) => {
  const strValue = `${inputCurrentTextualValue.value}`
  const lastChar = strValue[strValue.length - 1]

  // basic allowed keys
  const allowedKeys: string[] = [KeyNames.ARROW_DOWN, KeyNames.ARROW_LEFT, KeyNames.ARROW_RIGHT, KeyNames.ARROW_UP, KeyNames.ENTER, KeyNames.BACKSPACE]
  // if first char, allow minus
  if (strValue.length === 0) allowedKeys.push('-')
  // else if after a digit, allow float chars
  else if (!['-', ',', '.'].includes(lastChar)) allowedKeys.push(',', '.')
  // add digits to allowed keys
  for (let digit = 0; digit < 10; digit++) allowedKeys.push(`${digit}`)

  if (!allowedKeys.includes(event.key)) event.preventDefault()
};


/* >=========== BASE SETUP */
inputCurrentTextualValue.value = getValueAsPrintableString(props.modelValue)
if (props.min) {
  updatableMin.value = getValueAsPrintableString(props.min)
}

if (props.max) {
  updatableMax.value = getValueAsPrintableString(props.max)
}

/* >=========== HANDLE INPUT'S VALUE UPDATE */
// in this component, based on the type of input, the value that is manipulated by the v-model can be updated by the user in different ways
// it can be updated directly inside the input, like it would normally be the case with a regular input
// but it can also be updated via custom ways, like the eth-input-dropdown
// those custom ways deals with non-textual values, and updates the v-model on their own
// and the textual value of the input shown to the user has only a diplay or interactivity purposes. In this case the textual value is not to be emitted

/*  TOGGLE & CHECKBOX */
const handleBooleanValueUpdate = () => {
  // update local state
  isChecked.value = !isChecked.value
  emitEvent('update:modelValue', isChecked.value)
  emitEvent('input', isChecked.value)

  inputCurrentTextualValue.value = getValueAsPrintableString(isChecked.value)
}

/* TEXTAREA */
const handleTextareaValueUpdate = () => {
  inputCurrentTextualValue.value = (textareaEditableRef.value && textareaEditableRef.value.innerText) || ''
  emitEvent('update:modelValue', inputCurrentTextualValue.value)
}

// based on the type of input, dispatch the handling to the appropriate function
const dispatchValueUpdateHandling = (event: Event) => {
  debounce = true

  const target = event.target as HTMLInputElement
  inputCurrentTextualValue.value = target.value

  if (props.type === InputTypes.CHECKBOX || props.type === InputTypes.TOGGLE) {
    handleBooleanValueUpdate()
  }
  else if (props.type === InputTypes.TEXTAREA)
    handleTextareaValueUpdate()
  else if (props.type === InputTypes.NUMBER) {
    emitEvent('update:modelValue', Number(inputCurrentTextualValue.value))
  }
  else if (props.type !== InputTypes.SELECT && props.type !== InputTypes.DATE && props.type !== InputTypes.TIME)
    emitEvent('update:modelValue', target.value)

  emitEvent('input', event)
}

/* >=========== HANDLE KEYDOWN EVENT */
const dispatchInputWrapperClickEvent = () => {
  if (props.type === InputTypes.SELECT) openDropdown(true)
  if (props.type === InputTypes.ADDRESS) openDropdown(false)
}

/* >=========== HANDLE KEYDOWN EVENT */
// catches any keydown event
const dispatchKeydownEvent = (event: KeyboardEvent | undefined) => {
  if (!event) return;

  if (props.type === InputTypes.DATE) dateKeyboardTrigger(event)
  else if (props.type === InputTypes.TIME) timeKeyboardTrigger(event)
  else if (props.type === InputTypes.NUMBER) preventNonNumeric(event)
  else if (props.type === InputTypes.SELECT && !!props.filterable) filterKeyBoardTrigger()
  else if (props.type === InputTypes.ADDRESS)
  {
    const selectionKeys: string[] = [KeyNames.ARROW_UP, KeyNames.ARROW_DOWN, KeyNames.ENTER]
    // and check if current event is allowed so
    if (selectionKeys.includes(event.key)) focusDropdown.value = true
  }
};

// catches the specific ENTER key down event
const dispatchKeydownEnter = () => {
  if (props.type === InputTypes.SELECT) {
    toggleOptions.value = !toggleOptions.value
    focusDropdown.value = toggleOptions.value
  }
  if (props.type === InputTypes.TOGGLE || props.type === InputTypes.CHECKBOX )
  {
    handleBooleanValueUpdate()
  }
}

/* >=========== HANDLE DATE INPUT VALUE UPDATE */
// restrain value between min and max, if specified
const restrainDateToBoundaries = () => {
  if (!inputCurrentTextualValue.value || (!updatableMin.value && !updatableMax.value)) return

  const current = useUtils().dates.getDateFromStr(inputCurrentTextualValue.value.toString(), 'yyyy-MM-dd')
  if (!current) return

  // if boundaries, then restrain value
  if (updatableMin.value && useUtils().types.isString(updatableMin.value)) {
    const min = useUtils().dates.getDateFromStr(updatableMin.value, 'yyyy-MM-dd')
    if (!min) return

    if (!useUtils().dates.isDateTheSameDayOrAfter(current, min))
      inputCurrentTextualValue.value = updatableMin.value
  }

  if (updatableMax.value && useUtils().types.isString(updatableMax.value)) {
    const max = useUtils().dates.getDateFromStr(updatableMax.value, 'yyyy-MM-dd')
    if (!max) return

    if (!useUtils().dates.isDateTheSameDayOrBefore(current, max))
      inputCurrentTextualValue.value = updatableMax.value
  }
}

const handleDateValueUpdate = () => {
  if (!inputCurrentTextualValue.value) return
  // restrain value between min and max, if specified
  restrainDateToBoundaries()

  // convert and emit the new date
  const newValue = useUtils().dates.formatStrDate(inputCurrentTextualValue.value.toString(), 'yyyy-MM-dd', 'dd/MM/yyyy');

  emitEvent('update:modelValue', newValue);
  emitEvent('input', newValue);
}

/* HANDLE KEYBOARD */
// Handle on enter keydown
const dateKeyboardTrigger = (event: KeyboardEvent | undefined) => {
  if (!event) return
  const inputDateElement = document.querySelector(`.${InputTypes.DATE}-field`) as HTMLInputElement

  if (!inputDateElement) return
  if (event.key !== KeyNames.ENTER) return

  event.preventDefault()

  handleDateValueUpdate()
}

const filterKeyBoardTrigger = () => {
  debounce = true

  // filter updatableSelectOptions depending on the input value
  const filteredOptions = props.selectOptions.filter((option) => {
    if (!option.display) return false
    return option.display.toLowerCase().includes(`${inputCurrentTextualValue?.value}`.toLowerCase() || '')
  })

  // update the filtered options
  updatableSelectOptions.value = filteredOptions
}

// watch keyboard event to handle on enter
watch(() => keydownEvent.value, dispatchKeydownEvent)

/* >=========== HANDLE TIME INPUT VALUE UPDATE */
// restrain value between min and max, if specified
const restrainTimeToBoundaries = () => {
  if (!inputCurrentTextualValue.value || (!updatableMin.value && !updatableMax.value)) return;

  const current = useUtils().times.getTimeFromTimeStr(inputCurrentTextualValue.value.toString(), 'HH:mm');

  if (updatableMin.value && useUtils().types.isString(updatableMin.value)) {
    const min = useUtils().times.getTimeFromTimeStr(updatableMin.value, 'HH:mm');

    if (!useUtils().times.isTimeSameOrAfter(current, min))
      inputCurrentTextualValue.value = updatableMin.value;
  }

  if (updatableMax.value && useUtils().types.isString(updatableMax.value)) {
    const max = useUtils().times.getTimeFromTimeStr(updatableMax.value, 'HH:mm');

    if (!useUtils().times.isTimeSameOrBefore(current, max))
      inputCurrentTextualValue.value = updatableMax.value;
  }
}

const restrainNumberToBoundaries = () => {
  if (!inputCurrentTextualValue.value || (!updatableMin.value && !updatableMax.value)) return;

  if (updatableMin.value && useUtils().types.isString(updatableMin.value)) {
    const min = +updatableMin.value

    if (+inputCurrentTextualValue.value < min) inputCurrentTextualValue.value = updatableMin.value
  }

  if (updatableMax.value && useUtils().types.isString(updatableMax.value)) {
    const max = +updatableMax.value
    if (+inputCurrentTextualValue.value > max) inputCurrentTextualValue.value = updatableMax.value
  }
}

const handleTimeValueUpdate = () => {
  if (!inputCurrentTextualValue.value) return

  // restrain value between min and max, if specified
  restrainTimeToBoundaries()

  // convert and emit the new date
  emitEvent('update:modelValue', useUtils().dates.formatStrDate(inputCurrentTextualValue.value.toString(), 'HH:mm', 'HH:mm'))
}

/* HANDLE KEYBOARD */
// Handle on enter keydown
const timeKeyboardTrigger = (event: KeyboardEvent | undefined) => {
  if (!event) return
  const inputDateElement = document.querySelector(`.${InputTypes.DATE}-field`) as HTMLInputElement

  if (!inputDateElement || event.key !== KeyNames.ENTER) return

  event.preventDefault()

  handleTimeValueUpdate()
}


/* <=========== HANDLE TIME INPUT VALUE UPDATE */

const handleNumberValueUpdateOnBlur = () => {
  if (!inputCurrentTextualValue.value) return

  // restrain value between min and max, if specified
  restrainNumberToBoundaries()
  emitEvent('update:modelValue', Number(inputCurrentTextualValue.value))
}

const dispatchBlurEvent = (event: FocusEvent) => {
  if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as HTMLElement))
    return
  if (props.type === InputTypes.DATE) handleDateValueUpdate()
  if (props.type === InputTypes.TIME) handleTimeValueUpdate()
  if (props.type === InputTypes.NUMBER) handleNumberValueUpdateOnBlur()

  emitEvent('blur', event)
  disableDropdown()
}

/* <=========== HANDLE INPUT'S VALUE UPDATE */


/* >=========== HANDLE SELECT & DROPDOWN */
// once an option is selected, emit it
const emitSelectedOption = (option: IInputSelectOptions) => {

  emitEvent('update:modelValue', option.value)
  disableDropdown()

  // set the input textual value accordingly
  inputCurrentTextualValue.value = option.display
}

// if options are updated, take their new value and if needed reset the default selected option
const setUpdatableSelectOptions = (newOptions: IInputSelectOptions[]) => {
  updatableSelectOptions.value = newOptions

  if (props.type === InputTypes.SELECT) {
    // check if option has selected
    let preSelectedOption = updatableSelectOptions.value.find((element) => element.state === SelectOptionStates.SELECTED)

    // else try to get the one from props modelValue input
    preSelectedOption = preSelectedOption || updatableSelectOptions.value.find((option) => option.value === props.modelValue)

    // else if there is at least one that is not disabled
    preSelectedOption = preSelectedOption || updatableSelectOptions.value.find((option) => !option.state || option.state !== SelectOptionStates.DISABLED)

    // if option to select, select  it
    if (preSelectedOption) emitSelectedOption(preSelectedOption)
  }
}

const openDropdown = (focus: boolean) => {
  toggleOptions.value = true
  if (!props.filterable) focusDropdown.value = focus
}

const disableDropdown = () => {
  toggleOptions.value = false
  focusDropdown.value = false
}

// by default, set the options by default with thoses provided by props
setUpdatableSelectOptions(props.selectOptions)

// and if thoses props options update, update ours accordingly
watch(() => props.selectOptions, setUpdatableSelectOptions)
/* <=========== HANDLE SELECT & DROPDOWN */

// reset input value on external prop modelValue update
watch(
  () => props.modelValue,
  () => {
    // prevent feedback loop on textarea
    if (debounce) {
      debounce = false
      return
    }
    // special cases based on input types
    if (props.type === InputTypes.TOGGLE || props.type === InputTypes.CHECKBOX)
    {
      isChecked.value = props.modelValue as boolean
      inputCurrentTextualValue.value = getValueAsPrintableString(isChecked.value)

    }
    else if (props.type === InputTypes.TEXTAREA && textareaEditableRef.value) {
      inputCurrentTextualValue.value = getValueAsPrintableString(props.modelValue)
      textareaEditableRef.value.innerText = inputCurrentTextualValue.value
    }

    // default case
    else {
      inputCurrentTextualValue.value = getValueAsPrintableString(props.modelValue) as string
    }
  },
  { immediate: true }
)

// update relevant local variables when corresponding props are updated
watch(() => props.min, () => updatableMin.value = getValueAsPrintableString(props.min))
watch(() => props.max, () => updatableMax.value = getValueAsPrintableString(props.max))

// wait initilization and setup the textarea
watch(textareaEditableRef, () => {
  if (textareaEditableRef.value) {
    textareaEditableRef.value.innerText = getValueAsPrintableString(props.modelValue)
  }
}, { immediate: true })

function getWindowSize()
{
  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

/* >=========== HANDLE MOUNTED STEP */

const getClassBasedOnTheme = () => {
  customTheme.value = themeClassMap.value[props.theme as string]
  }


onMounted(() => {
  // CATCH KEYBOARD EVENTS
  const parentElement = document.getElementById(`section-${props.id}`)

  getWindowSize()
  window.addEventListener('resize', getWindowSize)

  if (parentElement) {
    parentElement.addEventListener('keydown', (event: KeyboardEvent) => keydownEvent.value = event, false);
  }

  getClassBasedOnTheme()
})
/* <=========== HANDLE MOUNTED STEP */
</script>

<style lang="scss" scoped>
:root {
  --checkbox-control-disabled: $color-dark-blue;
  --placeholder-content: 'test ici';
}

.eth-input {
  position: relative;
  margin: 10px 0;
  padding: 0;
  flex-direction: column;
  align-items: start;

  &.dark-theme {
    .icon {
      color: white;
    }
    .modal-input-wrapper .modal-input,
    .container .input-def {
      background-color: transparent;
      color: $white;
    }

    .modal-input-wrapper .modal-input {
      border-color: $white;
    }
  }
  &-wrapper {
    position: relative;
    width: 100%;
  }
  .input-def {
    outline: none;
    user-select: none;
    border: transparent 1px solid;
    position: relative;
  }

  /* Remove or change default style */
  input[type='date']::-webkit-inner-spin-button {
    display: none;
    appearance: none;
    -webkit-appearance: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
    /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
    /* Firefox */
  }

  input[type='radio'] {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    width: auto;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    white-space: nowrap;
  }

  label.disabled,
  .disabled {
    cursor: not-allowed;
  }

  .text input:disabled,
  .address input:disabled,
  .number input:disabled,
  .password input:disabled,
  .email input:disabled,
  .url input:disabled,
  .texarea input:disabled,
  .date input:disabled,
  .time input:disabled,
  input:disabled,
  .disabled {
    background-color: #f8f8f8;
    cursor: not-allowed !important;

    & ~ label {
      cursor: not-allowed !important;
    }

    & + .icon {
      cursor: not-allowed;
    }
  }

  .checkbox-field input:disabled + .label,
  .disabled {
    cursor: not-allowed !important;
  }

  small {
    display: block;
    color: $color-error;
    padding: 4px 0;
    text-align: left;
  }

  /* TYPE */
  input,
  .text,
  .password,
  .email,
  .date,
  .number,
  .address,
  .tel,
  .select,
  .url,
  .time,
  .select,
  .textarea {
    & -unit {
      right: 28px;
    }
    position: relative;
    width: 100%;

    &[contenteditable]:empty::before {
      content: var(--placeholder-content);
      color: gray;
    }

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
    .input-field,
    .text-field,
    .password-field,
    .email-field,
    .address-field,
    .number-field,
    .date-field,
    .tel-field,
    .time-field,
    .url-field,
    .select-field,
    .textarea-field {
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

      &::placeholder {
        opacity: 0;
        transition: opacity 0.2s;
      }

      &:placeholder-shown ~ label {
        @include fontLabelRules;
        cursor: text;
        top: 25px;
      }

      /* focus */
      &:focus ~ .label {
        position: absolute;
        top: 0;
        display: block;
        transition: 0.2s;
        @include fontLabelRules;
      }

      &:focus::placeholder {
        color: $color-grey;
        opacity: 1;
      }

      /* reset input */
      &:required,
      &:invalid {
        box-shadow: none;
      }
    }

    input[error='true'] {
      border: solid 1px $color-error;
    }

    /* LABEL */
    .label {
      position: absolute;
      top: 0;
      padding: 0 7px;
      display: block;
      transition: 0.2s;
      @include fontLabelRules;
    }
  }

  .label-textarea {
    padding-left: 7px;
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
      --bg: white;
      background-color: var(--bg);
      position: absolute;
      top: -25%;
      width: fit-content;
      padding: 0 6px;
      margin-left: 10px;
      font-family: 'Nunito';
      font-size: 14px;
      // background-color: #fff;
    }

    .modal-icon {
      position: absolute;
      top: 7px;
      right: 10px;
      border: none;
      background-color: transparent;
      cursor: pointer;
    }

    .unit {
      position: absolute;
      top: 30%;
      right: 6px;
      font-family: 'Nunito';
      font-size: 12px;
      border: none;
      background-color: transparent;
    }

    input[error='true'] {
      border: solid 1px $color-error;
    }
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    input[type='checkbox'] {
      position: relative;

      appearance: none;
      -webkit-appearance: none;
      display: grid;
      place-content: center;
      width: 10px;
      height: 10px;
      margin: 0 5px 6px 0;
      color: currentColor;
      background-color: #fff;
      border: solid 0.5px $color-dark-blue;
      font: inherit;
      transform: translateY(0.185em);
      cursor: pointer;

      small {
        color: green;
      }

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em $color-neon-blue;
      }

      &:checked::before {
        transform: scale(1);
      }

      &:checked::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #000;
        clip-path: polygon(1% 51%, 26% 89%, 98% 5%, 87% 4%, 26% 75%, 11% 51%);
      }

      &:disabled,
      .disabled {
        cursor: not-allowed;

        &::before {
          content: '';
          width: 0.65em;
          height: 0.65em;
          transition: 120ms transform ease-in-out;
          transform-origin: bottom left;
          box-shadow: inset 1em 1em currentColor;
        }

        &:hover {
          border: solid 0.5px $color-dark-blue;
        }
      }

      &:hover {
        border: 1px solid currentColor;
        box-sizing: border-box;
      }
    }

    input[error='true'] {
      border: solid 0.5px $color-error;
    }

    .label {
      margin: auto 0;
      font-size: 11px;
      cursor: pointer;
    }
  }

  input:disabled ~ label {
    cursor: none;
    color: red;
  }

  .is-not-checked,
  .is-checked {
    display: flex;
    justify-content: space-between;
    border: 0.5px solid;

    input {
      display: none;
    }

    .text {
      display: block;
      text-align: center;
    }
  }

  // TODO repenser le toggle
  .text--yes,
  .text--no {
    @include toggleBgWhite;
  }
  .is-not-checked {
    .text--no {
      font-weight: $font-weight-3;
    }
  }
  .is-checked {
    .text--yes {
      font-weight: $font-weight-3;
    }
  }

  .textarea {
    position: relative;
    border: 1px solid #dcdcdc;
    font-family: inherit;
    font-size: inherit;
    padding: 1px 6px;
    display: block;
    width: 100%;
    overflow: hidden;
    resize: both;
    min-height: 40px;
    line-height: 20px;
    max-height: 150px;
    overflow-y: auto;
    min-width: 200px;
    padding-top: 5px;
    position: relative;
    resize: vertical;
    max-width: 100%;
    &-modal {
      border: 1px solid $color-dark-blue;
    }

    &.error {
      border: solid 1px $color-error;
    }
  }
  &.grey-theme {
    .textarea {
      border: none;
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
    &.grey-theme {
      z-index: 0;
    }
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

  small.no-error {
    height: 17px;
  }

  .checkbox-field ~ label {
    top: 2px !important;
    left: 10px;
  }

  .modal-input.input-unit {
    text-align: right;
    padding: 1px 25px 1px 10px;

    &.icon-input {
      padding-right: 50px;
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
    z-index: 999;
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
    bottom: 5px !important;
    right: var(--right-offset) !important;
  }
}

.input-wrapper-textaera {
  display: flex;
  flex-direction: column-reverse;
  &.grey-theme {
    background-color: $color-grey-blue;
  }
}

small.checkbox-error {
  padding-left: 25px;
  padding-top: $spacing-1;
}

.activeToggle {
  position: absolute;
  width: calc(50% + 4px) !important;
  height: calc(100% + 4px);
  top: -2px;
  background-color: $color-neon-blue;
  z-index: 10;
  transition: 0.5s ease;
}

.left {
  left: -2px;
}

.right {
  left: calc(50% - 2px);
}

.eth-input-wrapper {
  position: relative;
}
</style>
