import { centerServices, serviceOptions } from '@/tests/mockups/data/center-services.mockup'

export type TServicesData = { services: ICenterService[]; options: IServiceOption[] }

export const useCenterServicesEndpoint = () => {
  const _path = '/center-services'
  return {
    getAllCenterServices: async (): Promise<IRequestResult<TServicesData>> => {
      // TODO: rework those functions when center services becomes dynamic
      // ! this return type doesn't match API's behavior
      // mocked up implementation
      return { data: { services: centerServices, options: serviceOptions }, error: null }

      // real implementation
      const response = await useRequest().get<TServicesData>(_path)
      return response
    }
  }
}
