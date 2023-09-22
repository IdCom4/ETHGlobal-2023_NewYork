import { defineStore } from 'pinia'

export const loadingStore = defineStore({
  id: 'loading',
  state: () => ({
    loading: false
  }),
  actions: {
    /**
     *
     * @param {boolean} stateValue
     */
    setLoading(stateValue: boolean) {
      this.loading = stateValue
    }
  }
})
