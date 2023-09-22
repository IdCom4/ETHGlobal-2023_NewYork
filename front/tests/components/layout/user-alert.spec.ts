import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'

// import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { useAlertStore } from '@/stores/alertStore'

import UserAlertComponent from '@/components/layout/user-alert.client.vue'
import { AlertStatuses } from '@/types/constants'

describe('testing user alert component', () => {
  let wrapper: VueWrapper
  let alertStore: ReturnType<typeof useAlertStore>

  beforeEach(() => {
    wrapper = shallowMount(UserAlertComponent, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              alert: { alert: null }
            },
            stubActions: false
          })
        ],
        stubs: {
          fa: true
        }
      }
    })

    alertStore = useAlertStore()
  })

  it('testing initial state without alert', () => {
    const alertContainer = wrapper.find('#user-alert')

    // checking that the content exists but is closed
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes().includes('open')).toBeFalsy()
  })

  it('testing with sending a success alert', async () => {
    const alertMessage = 'Hello World'
    // send a success alert
    alertStore.sendAlert(AlertStatuses.SUCCESS, alertMessage)

    // check that the store action have been called
    expect(alertStore.sendAlert).toHaveBeenCalled()

    // wait for the changes to be accounted for
    await wrapper.vm.$nextTick()

    const alertContainer = wrapper.find('#user-alert')

    // check that the container exists, is open and but hasn't the "error" class
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes()).toContain('open')
    expect(alertContainer.classes().includes('error')).toBeFalsy()

    const alertMessageTag = wrapper.find('.user-alert-message > p')

    // check that the <p /> tag is present and has the alert message for content
    expect(alertMessageTag.exists()).toBe(true)
    expect(alertMessageTag.text()).toEqual(alertMessage)
  })

  it('testing with sending an error alert', async () => {
    const alertMessage = 'How are you ?'
    // send an error alert
    alertStore.sendAlert(AlertStatuses.ERROR, alertMessage)

    // check that the store action have been called
    expect(alertStore.sendAlert).toHaveBeenCalled()

    await wrapper.vm.$nextTick()

    const alertContainer = wrapper.find('#user-alert')

    // check that the container exists, is open and have the "error" class
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes()).toContain('open')
    expect(alertContainer.classes()).toContain('error')

    const alertMessageTag = wrapper.find('.user-alert-message > p')

    // check that the <p /> tag is present and has the alert message for content
    expect(alertMessageTag.exists()).toBe(true)
    expect(alertMessageTag.text()).toEqual(alertMessage)
  })

  it('testing with sending a short alert', async () => {
    const alertMessage = 'How are you ?'
    // send an alert with a short lifetime
    alertStore.sendAlert(AlertStatuses.ERROR, alertMessage, false, 200)

    expect(alertStore.sendAlert).toHaveBeenCalled()

    await wrapper.vm.$nextTick()

    let alertContainer = wrapper.find('#user-alert')

    // check that the container is now open
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes()).toContain('open')
    expect(alertContainer.classes()).toContain('error')

    // wait more than its lifetime
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    await wrapper.vm.$nextTick()

    alertContainer = wrapper.find('#user-alert')

    // and check that the container is closed again
    expect(alertContainer.classes().includes('open')).toBeFalsy()
    expect(alertContainer.classes()).toContain('error')
  })

  it('testing sending a persistant alert and closing it', async () => {
    const alertMessage = 'How are you ?'
    // sending a persistant alert with a short lifetime that should be ignored
    alertStore.sendAlert(AlertStatuses.SUCCESS, alertMessage, true, 200)

    expect(alertStore.sendAlert).toHaveBeenCalled()

    await wrapper.vm.$nextTick()

    let alertContainer = wrapper.find('#user-alert')

    // check that the container is now open
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes()).toContain('open')
    expect(alertContainer.classes().includes('error')).toBeFalsy()

    // wait more than its lifetime
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    await wrapper.vm.$nextTick()

    alertContainer = wrapper.find('#user-alert')
    // and check that the container is still open and populated with the alert content
    // check that the container exists, is open and doesn't have the "error" class
    expect(alertContainer.exists()).toBe(true)
    expect(alertContainer.classes()).toContain('open')
    expect(alertContainer.classes().includes('error')).toBeFalsy()

    const alertMessageTag = wrapper.find('.user-alert-message > p')

    // check that the <p /> tag is present and has the alert message for content
    expect(alertMessageTag.exists()).toBe(true)
    expect(alertMessageTag.text()).toEqual(alertMessage)

    // now click on the close button
    await wrapper.find('.user-alert-close > button').trigger('click')

    await wrapper.vm.$nextTick()

    alertContainer = wrapper.find('#user-alert')

    // and check that the container is closed again
    expect(alertContainer.classes().includes('open')).toBeFalsy()
    expect(alertContainer.classes().includes('error')).toBeFalsy()
  })

  afterEach(() => {
    alertStore.$reset()
  })
})
