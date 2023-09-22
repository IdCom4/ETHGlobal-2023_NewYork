// must be explicitly imported for vitest unit testing
import { defineStore } from 'pinia'

export interface ISessionStore {
  accessToken: string | null
  user: IUser | null
}

const storedData: ISessionStore = {
  accessToken: null,
  user: null
}

export const useSessionStore = defineStore({
  id: 'session',
  state: () => storedData,
  actions: {
    logIn(accessToken: string, user: IUser) {
      this.accessToken = accessToken
      this.user = user
    },
    logOut() {
      this.accessToken = null
      this.user = null
    },
    setNewAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    getUser<T extends IUser = IUser>(): T | null {
      return this.user as T | null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    isProfessional: (state) => !!state.user && !!state.user.professionalProfile,
    getUserFullName: (state) => (state.user ? `${state.user.name} ${state.user.lastName}` : null)
  },
  persist: true
})
