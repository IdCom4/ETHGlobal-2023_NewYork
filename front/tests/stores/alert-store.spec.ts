import { describe, it, expect, beforeEach, beforeAll, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAlertStore } from '@/stores/alertStore'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('AlertStore', () => {
  let alertStore: ReturnType<typeof useAlertStore>

  beforeEach(() => {
    alertStore = useAlertStore()
  })

  it('testing initial state', () => {
    expect(alertStore.alert).toBeNull()
  })

  it('testing sendAlert', () => {
    alertStore.sendAlert('error', 'this is the message')

    expect(alertStore.alert).toMatchObject({ status: 'error', message: 'this is the message', persistant: false, durationInMs: 5000 })
  })

  it('testing resetAlert', () => {
    alertStore.sendAlert('error', 'this is the message')
    alertStore.resetAlert()

    expect(alertStore.alert).toBeNull()
  })

  afterEach(() => {
    alertStore.$reset()
  })
})
