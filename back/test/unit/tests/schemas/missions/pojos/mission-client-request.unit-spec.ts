import { MissionClientRequest } from '@Schemas/mission'
import { PublicFile, StrictAddress } from '@Schemas/common/pojos'

describe('Schema - MissionClientRequest', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const clientId = 'clientId'
    const vehicleId = 'vehicleId'
    const issueIds = ['issueId1', 'issueId2']
    const description = 'description'
    const idealStartingMoment = 'Dans 30 ans'
    const idealPickupAddress = StrictAddress.of('street', 'city', 'zipCode', [1, 1])
    const maxDistance = 100
    const hasSpareParts = true
    const attachments = [new PublicFile('referenceId', 'url', 'image/png')]

    // When
    const missionReport = MissionClientRequest.of(
      clientId,
      vehicleId,
      issueIds,
      description,
      idealStartingMoment,
      idealPickupAddress,
      maxDistance,
      hasSpareParts,
      attachments
    )

    // Then
    expect(missionReport.clientId).toBe(clientId)
    expect(missionReport.vehicleId).toBe(vehicleId)
    expect(missionReport.issueIds).toBe(issueIds)
    expect(missionReport.description).toBe(description)
    expect(missionReport.idealStartingMoment).toBe(idealStartingMoment)
    expect(missionReport.idealPickupAddress).toBe(idealPickupAddress)
    expect(missionReport.maxDistance).toBe(maxDistance)
    expect(missionReport.hasSpareParts).toBe(hasSpareParts)
    expect(missionReport.attachments).toBe(attachments)
  })
})
