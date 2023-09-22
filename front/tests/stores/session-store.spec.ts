import { useSessionStore } from '@/stores/sessionStore'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { JohnDoe } from '@/tests/mockups/data/users.mockup'

function isStoreInInitialState(sessionStore: ReturnType<typeof useSessionStore>) {
  expect(sessionStore.accessToken).toBeNull()
  expect(sessionStore.user).toBeNull()

  expect(sessionStore.isLoggedIn).toEqual(false)
  expect(sessionStore.isProfessional).toEqual(false)
  expect(sessionStore.getUserFullName).toEqual(null)
}

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('AlertStore', () => {
  let sessionStore: ReturnType<typeof useSessionStore>

  beforeEach(() => {
    sessionStore = useSessionStore()
  })

  it('testing initial state', () => {
    isStoreInInitialState(sessionStore)
  })

  it('testing logIn', () => {
    sessionStore.logIn('token', JohnDoe)

    expect(sessionStore.accessToken).toEqual('token')
    expect(sessionStore.user?.name).toEqual(JohnDoe.name)
  })

  it('testing computeds', () => {
    sessionStore.logIn('token', JohnDoe)

    expect(sessionStore.isLoggedIn).toEqual(true)
    expect(sessionStore.isProfessional).toEqual(true)
    expect(sessionStore.getUserFullName).toEqual(`${JohnDoe.name} ${JohnDoe.lastName}`)
  })

  it('testing logOut', () => {
    sessionStore.logIn('token', JohnDoe)

    sessionStore.logOut()

    isStoreInInitialState(sessionStore)
  })

  afterEach(() => {
    sessionStore?.$reset()
  })
})
