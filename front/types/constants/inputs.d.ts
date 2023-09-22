declare global {
  interface IInputSelectOptions<T = unknown> {
    value: T
    display: string
    state?: SelectOptionStates
  }
}

export enum InputTypes {
  TEXT = 'text',
  NUMBER = 'number',
  PASSWORD = 'password',
  DATE = 'date',
  EMAIL = 'email',
  TEL = 'tel',
  URL = 'url',
  ADDRESS = 'address',
  TEXTAREA = 'textarea',
  TOGGLE = 'toggle',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TIME = 'time'
}

export enum SelectOptionStates {
  SELECTED = 'selected',
  DISABLED = 'disabled',
  AVAILABLE = 'available'
}

export enum SelectedOptionStyles {
  CHIP = 'chip',
  LIST = 'list',
  NONE = 'none'
}
