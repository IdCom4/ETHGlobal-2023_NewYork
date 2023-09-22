import VueHotjar from 'vue-hotjar-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueHotjar, { id: 1694199, isProduction: process.env.NODE_ENV === 'production' })
})
