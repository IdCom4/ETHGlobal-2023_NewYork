import { useAuthEndpoint } from './resources/api-endpoints/auth.endpoint'

export const useAPI = () => ({
  auth: useAuthEndpoint(),
})
