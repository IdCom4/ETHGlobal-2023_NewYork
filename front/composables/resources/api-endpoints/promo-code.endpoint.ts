export const usePromoCodeEndPoint = () => {
  const _path = '/promoCodes'
  const _request = useRequest()
  return {
    getPromoCode: async (code: string, alert?: IAlertControl): Promise<IRequestResult<IPromoCode>> => {
      if (!code) return { data: null, error: { message: 'Aucun code fourni', status: 404 } }

      //real implementation
      const response = await _request.get<IPromoCode>(`${_path}/${code}`, { alert: alert })
      return response
    }
  }
}
