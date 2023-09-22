import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import SignUpPage, * as validateForm from '@/pages/authentification/creer-un-compte/index.vue'

describe('SignUp page', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = shallowMount(SignUpPage)
  })

  it('should displays the form when the .navigation button is clicked', async () => {
    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.find('.question-section').exists()).toBe(true)

    await wrapper.find('.navigation').trigger('click')

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('.question-section').exists()).toBe(false)

    it('should check the form when the .call-to-action button is clicked', async () => {
      const validateFormSpy = vi.spyOn(validateForm, 'default')

      await wrapper.find('.call-to-action').trigger('click')
      expect(validateFormSpy).toHaveBeenCalled()
    })
  })
})
