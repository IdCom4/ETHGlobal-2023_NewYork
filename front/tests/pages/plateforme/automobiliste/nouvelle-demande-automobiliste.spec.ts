import { describe, it, expect, beforeEach } from 'vitest'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import NewMissionDemand from '@/pages/plateforme/automobiliste/nouvelle-demande/index.vue'

describe('New Automobilist Demand Mission Page', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = shallowMount(NewMissionDemand)
  })

  it('should displays the form with its sections', async () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('mission-address').exists()).toBe(true)
    expect(wrapper.find('mission-date').exists()).toBe(true)
    expect(wrapper.find('mission-description').exists()).toBe(true)
    expect(wrapper.find('mission-files').exists()).toBe(true)
    expect(wrapper.find('mission-header').exists()).toBe(true)
    expect(wrapper.find('mission-max-distance').exists()).toBe(true)
    expect(wrapper.find('mission-pieces').exists()).toBe(true)
    expect(wrapper.find('mission-issues').exists()).toBe(true)
    expect(wrapper.find('mission-vehicle').exists()).toBe(true)
  })
})
