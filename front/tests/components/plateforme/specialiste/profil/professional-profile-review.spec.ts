import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import profileReview from '@/components/plateforme/specialiste/profil/professional-profile-review.client.vue'

import { JohnDoe } from '@/tests/mockups/data/users.mockup'

describe('Testing profile review', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = shallowMount(profileReview, {
      props: { profile: JohnDoe },
      global: { stubs: { fa: true } }
    })
  })

  it('should display a review with every information', () => {
    expect(wrapper.find('client-review').exists()).toBeTruthy()
  })

  it('should display every review the professional have', () => {
    if (!JohnDoe.professionalProfile) return

    const numberOfReview = wrapper.findAll('.client-review').length

    expect(numberOfReview).toEqual(JohnDoe.professionalProfile.clientReviews.length)
  })
})
