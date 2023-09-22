import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Fa from '@/components/global/fa.client.vue'

config.autoAddCss = false
library.add(faCheck, faUser)

describe('Fa component testing suite', () => {
  it('testing with no props', () => {
    const wrapper = mount(Fa, { components: { FontAwesomeIcon } })

    expect(wrapper.exists()).toBe(true)

    const icon = wrapper.find('.--icon')

    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('fa-check')
  })

  it('testing with a prop', () => {
    const wrapper = mount(Fa, { components: { FontAwesomeIcon }, props: { icon: 'fa-solid fa-user' } })

    expect(wrapper.exists()).toBe(true)

    // const icon = wrapper.findComponent({ name: 'font-awesome-icon' })
    const icon = wrapper.find('.--icon')

    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('fa-user')
  })
})
