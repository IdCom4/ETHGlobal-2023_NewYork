import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import IReview from '@/components/plateforme/specialiste/profil/client-review.client.vue'

import { MONTHS } from '@/types/constants/time.d'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'

describe('Testing client review', () => {
  // we try to access to properties of the component that vm does not know
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(IReview, {
      props: { clientReview: JohnDoe.professionalProfile?.clientReviews[0] },
      global: { stubs: { fa: true } }
    })
  })

  it('should display users name', () => {
    if (!JohnDoe.professionalProfile) return

    expect(wrapper.find('p.name').exists()).toBeTruthy()
    expect(wrapper.vm.clientReview.userName).toEqual(JohnDoe.professionalProfile.clientReviews[0].userName)
  })

  it('should display the rating', () => {
    if (!JohnDoe.professionalProfile) return

    const rating = wrapper.findAll('.full').length

    expect(wrapper.find('div.stars').exists()).toBeTruthy()
    expect(rating).toEqual(JohnDoe.professionalProfile.clientReviews[0].rating)
  })

  it('should display the reviews date', () => {
    if (!JohnDoe.professionalProfile) return

    const monthIndex = parseInt(JohnDoe.professionalProfile.clientReviews[0].date.split('/')[1]) - 1
    const yearTest = JohnDoe.professionalProfile.clientReviews[0].date.slice(6, 10)

    expect(wrapper.find('p.date').exists()).toBeTruthy()
    expect(wrapper.vm.month).toEqual(MONTHS[monthIndex].SHORT)
    expect(wrapper.vm.year).toEqual(yearTest)
  })

  it('should display users review', () => {
    if (!JohnDoe.professionalProfile) return

    expect(wrapper.find('p#review-message').exists()).toBeTruthy()
    expect(wrapper.vm.clientReview.message).toEqual(JohnDoe.professionalProfile.clientReviews[0].message)
  })
})
