import { MissionReport } from '@Schemas/mission'

describe('Schema - MissionReport', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const vehicleMileage = 100000
    const interventionIds = ['id1', 'id2']
    const otherInterventions = ['other1', 'other2']

    // When
    const missionReport = MissionReport.of(vehicleMileage, interventionIds, otherInterventions)

    // Then
    expect(missionReport.vehicleMileage).toBe(vehicleMileage)
    expect(missionReport.interventionIds).toBe(interventionIds)
    expect(missionReport.otherInterventions).toBe(otherInterventions)
  })
})
