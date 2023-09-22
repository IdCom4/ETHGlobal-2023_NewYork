export default defineNuxtRouteMiddleware(() => {
  // execute only on client side
  if (!process.client) return

  const session = useSessionStore()
  if (!session.isLoggedIn || !session.isProfessional) return navigateTo('/')
})
