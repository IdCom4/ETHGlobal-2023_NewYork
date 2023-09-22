import { AlertModes } from '@/types/constants'

class MissonAPIBridge {
  static readonly PATH = '/missions'

  public static async getAvailableProfessionalsForAddressAndIssues(
    payload: { address: IStrictAddress; maxDistance: number; issueIds: string[] },
    alert: IAlertControl = { mode: AlertModes.NONE }
  ): Promise<IRequestResult<ILiteProfessionalProfile[]>> {
    return await useRequest().post<ILiteProfessionalProfile[]>(MissonAPIBridge.PATH + '/available-professionals', { body: payload, alert })
  }

  public static async createMission(
    payload: ICreateMissionPayload,
    alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Mission crée avec succès' }
  ): Promise<IRequestResult<IMission>> {
    return await useRequest().post<IMission>(MissonAPIBridge.PATH, { body: payload, alert })
  }

  public static async professionalRefuseMission(
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Mission refusée avec succès !' }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().post<IRequestResponse>(MissonAPIBridge.PATH + `/refuse/${missionId}`, { alert })
  }

  public static async updateProfessionalProposal(
    request: IMissionProposalPayload,
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Devis mis à jour avec succès !' }
  ): Promise<IRequestResult<IProfessionalMission>> {
    return await useRequest().patch<IProfessionalMission>(MissonAPIBridge.PATH + `/send-proposal/${missionId}`, { body: request, alert })
  }

  public static async updateProfessionalPrivateNote(
    privateNote: string,
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Note mise à jour' }
  ): Promise<IRequestResult<IProfessionalMission>> {
    return await useRequest().patch<IProfessionalMission>(MissonAPIBridge.PATH + `/update-private-note/${missionId}`, {
      body: { privateNote },
      alert
    })
  }

  public static async clientDenyProfessional(
    missionId: string,
    professionalId: string,
    alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Spécialiste refusé avec succès' }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().patch<IRequestResponse>(MissonAPIBridge.PATH + `/deny-professional/${missionId}?professional-id=${professionalId}`, {
      alert
    })
  }

  public static async clientAcceptProfessionalProposal(
    missionId: string,
    professionalId: string,
    alert: IAlertControl = { mode: AlertModes.ALL }
  ): Promise<IRequestResult<IPaymentIntentResponse>> {
    return await useRequest().patch<IPaymentIntentResponse>(
      MissonAPIBridge.PATH + `/accept-proposal/${missionId}?professional-id=${professionalId}`,
      {
        alert
      }
    )
  }

  public static async professionalFinishMission(
    missionId: string,
    payload: IFinishMissionPayload,
    alert: IAlertControl = { mode: AlertModes.ALL }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().patch<IRequestResponse>(MissonAPIBridge.PATH + `/finish/${missionId}`, {
      body: payload,
      alert
    })
  }

  public static async clientValidateMission(
    missionId: string,
    payload: IValidateMissionPayload,
    alert: IAlertControl = { mode: AlertModes.ALL }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().patch<IRequestResponse>(MissonAPIBridge.PATH + `/validate/${missionId}`, {
      body: payload,
      alert
    })
  }

  public static async clientOpenDispute(
    missionId: string,
    payload: { reason: string },
    alert: IAlertControl = { mode: AlertModes.ALL }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().patch<IRequestResponse>(MissonAPIBridge.PATH + `/open-dispute/${missionId}`, {
      body: payload,
      alert
    })
  }

  public static async clientCancelMission(
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ALL }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().post<IRequestResponse>(MissonAPIBridge.PATH + `/cancel/${missionId}`, { alert })
  }

  public static async sendMessageTo(
    missionId: string,
    payload: ISendMessagePayload,
    alert: IAlertControl = { mode: AlertModes.ON_ERROR }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().post<IRequestResponse>(MissonAPIBridge.PATH + `/message/${missionId}`, { body: payload, alert })
  }

  public static async setMessageAsSeen(
    missionId: string,
    professionalId: string,
    messageIndex: number,
    alert: IAlertControl = { mode: AlertModes.ON_ERROR }
  ): Promise<IRequestResult<IRequestResponse>> {
    return await useRequest().patch<IRequestResponse>(
      MissonAPIBridge.PATH + `/message/${missionId}?professional-id=${professionalId}&message-index=${messageIndex}`,
      { alert }
    )
  }

  /* >==== GETTERS ===> */

  public static async getClientMissions(alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<IMission[]>> {
    return await useRequest().get<IMission[]>(MissonAPIBridge.PATH + '/client', { alert })
  }

  public static async getClientMissionById(
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ON_ERROR }
  ): Promise<IRequestResult<IMission>> {
    return await useRequest().get<IMission>(MissonAPIBridge.PATH + `/client/by-id/${missionId}`, { alert })
  }

  // public static async getProfessionalMissions(): Promise<IRequestResult<IProfessionalMission[]>> {
  public static async getProfessionalMissions(alert: IAlertControl = { mode: AlertModes.ON_ERROR }): Promise<IRequestResult<IProfessionalMission[]>> {
    //TODO: do not forget to change this line
    return await useRequest().get<IProfessionalMission[]>(MissonAPIBridge.PATH + '/professional', { alert })
    // return { data: missions as IProfessionalMission[], error: null }
  }

  public static async getProfessionalMissionById(
    missionId: string,
    alert: IAlertControl = { mode: AlertModes.ON_ERROR }
  ): Promise<IRequestResult<IProfessionalMission>> {
    return await useRequest().get<IProfessionalMission>(MissonAPIBridge.PATH + `/professional/by-id/${missionId}`, { alert })
  }
}

export const useMissionsEndpoint = () => {
  return MissonAPIBridge
}

export interface ICreateMissionPayload {
  vehicleId: string
  issueIds: string[]
  description: string
  idealStartingMoment: string
  idealPickupAddress: IStrictAddress
  maxDistance: number
  hasSpareParts: boolean
  attachments?: string[]
}

export interface IMissionProposalPayload {
  startDate: string // format: 'dd/MM/yyyy HH:mm'
  pickupAddress: IStrictAddress
  quote: IMissionQuotePayload
}

export interface IMissionQuotePayload {
  tvaRate: number
  workForces: IMissionQuoteProduct[]
  consumables: IMissionQuoteProduct[]
  placeAndEquipments: IMissionQuoteProduct[]
}

export interface IFinishMissionPayload {
  vehicleMileage: number
  interventionIds?: string[]
  otherInterventions?: string[]
}

export interface IValidateMissionPayload {
  reviewOfProfessional?: IReviewPayload
  reviewOfWebsite?: IReviewPayload
}

export interface ISendMessagePayload {
  receiverId: string
  content?: string
  attachment?: TBase64File
}
