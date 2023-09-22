import { AlertModes } from '@/types/constants'

export const useInterventionsEndpoint = () => {
  const _path = '/interventions'
  return {
    getInterventions: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<IIntervention[]>> => {
      const response = await useRequest().get<IIntervention[]>(_path, { alert })
      return response
    }
  }
}
