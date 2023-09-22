import { SelectOptionStates } from '@/assets/ts/enums/input-types.d'

export {}

declare global {
  interface IInputSelectOptions<T = unknown> {
    value: T
    display: string
    state?: SelectOptionStates
  }
}
