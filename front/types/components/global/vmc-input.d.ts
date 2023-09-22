import { SelectOptionStates } from '@/types/constants/input-types.d'

export {}

declare global {
  interface IInputSelectOptions<T = unknown> {
    value: T
    display: string
    state?: SelectOptionStates
  }
}
