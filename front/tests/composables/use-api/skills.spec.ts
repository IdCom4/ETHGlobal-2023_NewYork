import { describe, it, expect, beforeAll } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { skills } from '@/tests/mockups/data/skills.mockup'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('when testing /skills endpoints', () => {
  it('should return all services', async () => {
    const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturnData(skills).build()

    const response = await useAPI().skills.getSkills()

    expect(useFetchMock.callSpy).toHaveBeenCalled()

    expect(response.error).toBeNull()
    expect(response.data).toEqual(skills)
  })
})
