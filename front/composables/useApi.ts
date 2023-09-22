import { useAuthEndpoint } from './resources/api-endpoints/auth.endpoint'
import { useBookingsEndpoint } from './resources/api-endpoints/bookings.endpoint'
import { useCenterServicesEndpoint } from './resources/api-endpoints/center-services.endpoint'
import { useCentersEndpoint } from './resources/api-endpoints/centers.endpoint'
import { useInterventionsEndpoint } from './resources/api-endpoints/interventions.endpoint'
import { useInvoicesEndpoint } from './resources/api-endpoints/invoices.endpoint'
import { useIssuesEndpoint } from './resources/api-endpoints/issues.endpoint'
import { useMissionsEndpoint } from './resources/api-endpoints/missions.endpoint'
import { usePaymentEndpoint } from './resources/api-endpoints/payment.endpoint'
import { useProfessionalsEndpoint } from './resources/api-endpoints/professionals.endpoint'
import { usePromoCodeEndPoint } from './resources/api-endpoints/promo-code.endpoint'
import { useSkillsEndpoint } from './resources/api-endpoints/skills.endpoint'
import { useUsersEndpoint } from './resources/api-endpoints/users.endpoint'
import { useVehiclesEndpoint } from './resources/api-endpoints/vehicles.endpoint'

export const useAPI = () => ({
  auth: useAuthEndpoint(),
  users: useUsersEndpoint(),
  professionals: useProfessionalsEndpoint(),
  skills: useSkillsEndpoint(),
  centers: useCentersEndpoint(),
  bookings: useBookingsEndpoint(),
  promoCode: usePromoCodeEndPoint(),
  centerServices: useCenterServicesEndpoint(),
  vehicles: useVehiclesEndpoint(),
  missions: useMissionsEndpoint(),
  issues: useIssuesEndpoint(),
  payment: usePaymentEndpoint(),
  invoices: useInvoicesEndpoint(),
  interventions: useInterventionsEndpoint()
})
