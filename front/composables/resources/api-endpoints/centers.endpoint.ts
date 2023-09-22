import { AlertModes } from '@/types/constants'

export const useCentersEndpoint = () => {
  const _path = '/centers'
  const _request = useRequest()

  return {
    getCenterFormulas: async (
      centerId: string,
      alert: IAlertControl = { mode: AlertModes.NONE }
    ): Promise<IRequestResult<TBoxCategoriesFormulas>> => {
      return await _request.get<TBoxCategoriesFormulas>(`${_path}/formulas/${centerId}`, { alert })
    },
    getCenters: async (alert: IAlertControl = { mode: AlertModes.NONE }): Promise<IRequestResult<ICenter[]>> => {
      return await _request.get<ICenter[]>(`${_path}`, { alert })
    }
  }
}
