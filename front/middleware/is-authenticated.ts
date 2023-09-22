export default defineNuxtRouteMiddleware(() => {
  const session = useSessionStore()
  if (!session.isLoggedIn) return navigateTo('/')
})
