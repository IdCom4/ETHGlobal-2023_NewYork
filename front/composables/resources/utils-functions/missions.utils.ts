import { MissionStatuses } from '@/assets/ts/enums'

class MissionsUtils {
  public static populateMissions<T extends IPopulatedMission | IPopulatedProfessionalMission = IPopulatedMission>(
    missions: IMission[],
    issues: IIssue[]
  ): T[] {
    const populatedMissions: T[] = missions.map((mission) => {
      const castMission: T = mission as T
      const missionClientIssues = mission.clientRequest.issueIds.map((id) => issues.find((issue) => issue._id === id))
      castMission.clientRequest.issues = missionClientIssues.filter((issue) => !!issue) as IIssue[]

      return castMission
    })

    return populatedMissions
  }
  public static getMyMissionAsProfessional(mission: IPopulatedMission): IMissionProfessionalEntry {
    return mission.professionalEntries[0]
  }

  public static getProfessionalAssignementToMission(mission: IPopulatedMission): IMissionProfessionalEntry {
    return mission.professionalEntries[0]
  }

  public static buildCardForProfessional(mission: IPopulatedMission): IMissionCardInfo<ILiteUser> {
    const professionalMission = MissionsUtils.getMyMissionAsProfessional(mission)
    // const professionalStartDate = professionalMission.proposal?.startDate
    // const professionalAddress = professionalMission.proposal?.pickupAddress

    return {
      user: mission.clientRequest.client,
      startDate: mission.clientRequest.idealStartingMoment,
      pickupAddress: mission.clientRequest.idealPickupAddress,
      issues: mission.clientRequest.issues,
      specialInfo: `${mission.clientRequest.client.name} ${mission.clientRequest.client.lastName}`,
      userId: mission.clientRequest.client._id,
      missionId: mission._id,
      vehicle: mission.clientRequest.vehicle,
      hasUnseenMessage: MissionsUtils.hasUnseenMessages(professionalMission.messages, professionalMission.professional._id)
    }
  }
  //Cartes du côté automobiliste. Ce sont des spécialistes sur les cartes
  public static buildCardForClient(mission: IPopulatedMission, professionalId: string): IMissionCardInfo<ILiteProfessionalUser> {
    const professional = mission.professionalEntries.find((entry) => entry.professional._id === professionalId)
    if (!professional) throw new Error("Le spécialiste n'est pas présent dans la mission")

    const professionalStartDate = professional.proposal?.startDate
    const professionalAddress = professional.proposal?.pickupAddress

    return {
      user: professional.professional,
      startDate: professionalStartDate ? professionalStartDate : mission.clientRequest.idealStartingMoment,
      pickupAddress: professionalAddress ? professionalAddress : mission.clientRequest.idealPickupAddress,
      issues: mission.clientRequest.issues,
      specialInfo: professional.professional.professionalProfile.businessName || '',
      userId: professional.professional._id,
      missionId: mission._id,
      vehicle: mission.clientRequest.vehicle,
      hasUnseenMessage: MissionsUtils.hasUnseenMessages(professional.messages, mission.clientRequest.client._id)
    }
  }

  public static buildMissionCardByProposal(mission: IPopulatedMission, professionalId: string): IMissionCardInfo<ILiteProfessionalUser> | null {
    return MissionsUtils.buildCardForClient(mission, professionalId)
  }

  public static buildEachMissionCardForClient(mission: IPopulatedMission): IMissionCardInfo<ILiteProfessionalUser>[] {
    return mission.professionalEntries.map((entry) => MissionsUtils.buildCardForClient(mission, entry.professional._id))
  }

  /**
   * Create each professional entry card for each given mission
   * @param missions given missions
   * @returns map with mission id as key and its card array as value
   */
  public static buildMissionsCardListForClient(missions: IPopulatedMission[]): Record<string, IMissionCardInfo<ILiteProfessionalUser>[]> {
    const missionsMap: Record<string, IMissionCardInfo<ILiteProfessionalUser>[]> = {}
    for (const mission of missions) {
      if (mission.professionalEntries.length > 0) missionsMap[mission._id] = MissionsUtils.buildEachMissionCardForClient(mission)
    }

    return missionsMap
  }
  /**
   * Create the client card for each given mission
   * @param missions given missions
   * @returns map with mission id as key and its card as value
   */
  public static buildMissionsCardListForProfessional(missions: IPopulatedMission[]): Record<string, IMissionCardInfo<ILiteUser>[]> {
    const missionsMap: Record<string, IMissionCardInfo<ILiteUser>[]> = {}
    for (const mission of missions) {
      missionsMap[mission._id] = [MissionsUtils.buildCardForProfessional(mission)]
    }

    return missionsMap
  }

  public static buildMissionsCardsForEachStatusForClient(sortedMissions: TMissionsByStatus): TMissionsCardInfoListByStatus<ILiteProfessionalUser> {
    const missionsCardsByCategory: Partial<TMissionsCardInfoListByStatus<ILiteProfessionalUser>> = {}

    for (const [status, missions] of Object.entries(sortedMissions)) {
      let processedStatus: MissionStatuses = status as MissionStatuses
      if (status === MissionStatuses.WAITING_FOR_QUOTE || status === MissionStatuses.QUOTE_PENDING) processedStatus = MissionStatuses.QUOTE_PENDING

      missionsCardsByCategory[processedStatus as MissionStatuses] = MissionsUtils.buildMissionsCardListForClient(missions)
    }

    return missionsCardsByCategory as TMissionsCardInfoListByStatus<ILiteProfessionalUser>
  }

  public static buildMissionsCardsForEachStatusForProfessional(sortedMissions: TMissionsByStatus): TMissionsCardInfoListByStatus<ILiteUser> {
    const missionsCardsByCategory: Partial<TMissionsCardInfoListByStatus<ILiteUser>> = {}

    for (const [status, missions] of Object.entries(sortedMissions)) {
      let processedStatus: MissionStatuses = status as MissionStatuses
      if (status === MissionStatuses.WAITING_FOR_QUOTE || status === MissionStatuses.QUOTE_PENDING)
        processedStatus = MissionStatuses.WAITING_FOR_QUOTE

      missionsCardsByCategory[processedStatus as MissionStatuses] = MissionsUtils.buildMissionsCardListForProfessional(missions)
    }

    return missionsCardsByCategory as TMissionsCardInfoListByStatus<ILiteUser>
  }

  public static buildMissionPraticalities(mission: IPopulatedMission): IMissionPraticalities | undefined {
    if (mission.status !== 'IN_PROGRESS') return
    return {
      idealAdress: mission.clientRequest.idealPickupAddress,
      idealStartingMoment: mission.clientRequest.idealStartingMoment,
      pickupAddress: mission.professionalEntries[0].proposal
        ? mission.professionalEntries[0].proposal.pickupAddress
        : mission.clientRequest.idealPickupAddress,
      startDate: mission.professionalEntries[0].proposal
        ? mission.professionalEntries[0].proposal.startDate
        : mission.clientRequest.idealStartingMoment
    }
  }

  /* public static associateMissionStatusWithOrder(): TStatusProgressOrder {
    const missionOrder: Partial<TStatusProgressOrder> = {}
    let i = 1
    for (const status in MissionStatuses) {
      missionOrder[status as TMissionStatusKey] = i
      i += 1
    }
    missionOrder['CANCELED'] = -1
    return missionOrder as TStatusProgressOrder
  } */

  public static hasUnseenMessages(messages: IMessage[], senderId: string): boolean {
    const hasUnseenMessages = ref(false)
    messages.forEach((message) => {
      //checks if the sender received a message and if the latter has been seen
      if (message.receiverId === senderId && !message.seenByAt[senderId]) hasUnseenMessages.value = true
    })
    return hasUnseenMessages.value
  }
}

export default MissionsUtils
