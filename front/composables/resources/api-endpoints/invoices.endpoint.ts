import { AlertModes } from '@/types/constants'

export interface ICreateVehicleInvoicePayload {
  vehicleId: string
  vehicleMileage: number
  interventionIds: Array<string>
  otherInterventions: Array<string>
  totalTTC: number
  invoiceFile: TBase64File
  madeAt: string // Date (format: 'dd/MM/yyyy HH:mm')
}

export type IUpdateVehicleInvoicePayload = Partial<ICreateVehicleInvoicePayload>

export const useInvoicesEndpoint = () => {
  const _path = '/invoices'

  return {
    getVehicleInvoiceById: async (
      invoiceId: string,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IVehicleInvoice>> => {
      return await useRequest().get<IVehicleInvoice>(_path + `/vehicle/${invoiceId}`, { alert })
    },
    getAllVehicleInvoices: async (
      vehicleId: string,
      alert: IAlertControl = { mode: AlertModes.ON_ERROR }
    ): Promise<IRequestResult<IVehicleInvoice[]>> => {
      return await useRequest().get<IVehicleInvoice[]>(_path + `/by-vehicle/${vehicleId}`, { alert })
    },
    createNewVehicleInvoice: async (
      payload: ICreateVehicleInvoicePayload,
      alert: IAlertControl = { mode: AlertModes.ALL }
    ): Promise<IRequestResult<IVehicleInvoice>> => {
      return await useRequest().post<IVehicleInvoice>(_path + `/vehicle`, { body: payload, alert })
    },
    updateVehicleInvoice: async (
      invoiceId: string,
      payload: IUpdateVehicleInvoicePayload,
      alert: IAlertControl = { mode: AlertModes.ALL }
    ): Promise<IRequestResult<IVehicleInvoice>> => {
      return await useRequest().patch<IVehicleInvoice>(_path + `/vehicle/${invoiceId}`, { body: payload, alert })
    },
    deleteInvoice: async (invoiceId: string, alert: IAlertControl = { mode: AlertModes.ALL }): Promise<IRequestResult<IRequestResponse>> => {
      return await useRequest().delete<IRequestResponse>(_path + `/${invoiceId}`, { alert })
    },
    downloadInvoice: async (invoiceId: string, alert: IAlertControl = { mode: AlertModes.ALL }): Promise<IRequestResult<string>> => {
      return await useRequest().get<string>(_path + `/download/${invoiceId}`, { alert })
    }
  }
}
