import { Mission, MissionClientRequest, MissionProfessionalEntry } from '@Schemas/mission'
import { StrictAddress } from '@Schemas/common/pojos'
import { MissionStatuses, PaymentProviderStatuses } from '@Common/enums'
import { BadRequestException } from '@nestjs/common'

const defaultClientRequest = MissionClientRequest.of(
  'clientId',
  'vehicleId',
  ['issueIds'],
  'description',
  'idealStartingMoment',
  StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
  100,
  false,
  []
)

describe('Schema - Intervention', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const professionalIds = ['professionalId']

    // When
    const mission = Mission.of(defaultClientRequest, professionalIds)

    // Then
    expect(mission.status).toBe(MissionStatuses.WAITING_FOR_QUOTE)
    expect(mission.clientRequest).toBe(defaultClientRequest)
    expect(mission.professionalEntries).toHaveLength(1)
    expect(mission.professionalEntries[0]).toBeInstanceOf(MissionProfessionalEntry)
    expect(mission.professionalEntries[0].professionalId).toBe(professionalIds[0])
    expect(mission.paymentData).toBeUndefined()
    expect(mission.report).toBeUndefined()
    expect(mission.invoiceId).toBeUndefined()
    expect(mission.adminRequiredAction).toBeUndefined()
    expect(mission.adminNote).toBeUndefined()
    expect(mission.dispute).toBeUndefined()
    expect(mission.clientFeedback).toBeUndefined()
    expect(mission.startedAt).toBeUndefined()
    expect(mission.finishedAt).toBeUndefined()
    expect(mission.deliveredAt).toBeUndefined()
    expect(mission.canceledAt).toBeUndefined()
    expect(mission.canceledByClient).toBeUndefined()
  })

  describe('When getting the chosen professional entry', () => {
    it('should return with valid information', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')

      // When
      const chosenProfessionalEntry = mission.getChosenProfessionalEntry()

      // Then
      expect(chosenProfessionalEntry).toBeInstanceOf(MissionProfessionalEntry)
      expect(chosenProfessionalEntry.professionalId).toBe('selectedProfessionalId')
    })

    it('should fail with no professional entry', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId'])

      // When
      const chosenProfessionalEntry = (): MissionProfessionalEntry => mission.getChosenProfessionalEntry()

      // Then
      expect(chosenProfessionalEntry).toThrow(BadRequestException)
    })
  })

  describe('When getting the chosen professional id', () => {
    it('should success with a valid id', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const chosenProfessionalEntry = mission.getProfessionalEntry('selectedProfessionalId')

      // Then
      expect(chosenProfessionalEntry).toBeInstanceOf(MissionProfessionalEntry)
      expect(chosenProfessionalEntry.professionalId).toBe('selectedProfessionalId')
    })

    it('should fail with unknown value', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const chosenProfessionalEntry = (): MissionProfessionalEntry => mission.getProfessionalEntry('unknownProfessionalId')

      // Then
      expect(chosenProfessionalEntry).toThrow()
    })
  })

  it('should return active professional entries', () => {
    // Given
    const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
    mission.setProfessionalAsRefusingTheMission('selectedProfessionalId')

    // When
    const chosenProfessionalEntry = mission.getRemainingActiveProfessionalEntries()

    // Then
    expect(chosenProfessionalEntry).toHaveLength(1)
  })

  it('should return active professional ids', () => {
    // Given
    const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
    mission.setProfessionalAsRefusingTheMission('professionalId')

    // When
    const chosenProfessionalEntry = mission.getRemainingActiveProfessionalIds()

    // Then
    expect(chosenProfessionalEntry).toHaveLength(1)
    expect(chosenProfessionalEntry[0]).toBe('selectedProfessionalId')
  })

  it('should define new admin required action', () => {
    // Given
    const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
    const newAction = 'Nouvelle action'

    // When
    mission.setAdminRequiredAction(newAction)

    // Then
    expect(mission.adminRequiredAction).toBe(newAction)
  })

  it('should define new admin note', () => {
    // Given
    const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
    const newAction = 'Nouvelle action'

    // When
    mission.setAdminRequiredAction(newAction)

    // Then
    expect(mission.adminRequiredAction).toBe(newAction)
  })

  describe('When checking if mission in on dispute', () => {
    it('should return false when not on dispute', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const isOnDispute = mission.isOnDispute()

      // Then
      expect(isOnDispute).toBe(false)
    })

    it('should return true when on dispute', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')
      mission.finish('selectedProfessionalId', 1500, [], ['Changement de la voiture'])
      mission.openDispute('clientId', "Je n'aime pas les brocolis")

      // When
      const isOnDispute = mission.isOnDispute()

      // Then
      expect(isOnDispute).toBe(true)
    })
  })

  describe('When denying a professional', () => {
    it('should success on valid state', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      mission.denyProfessional('selectedProfessionalId')

      // Then
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(false)
    })

    it('should fail with an already started mission', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.cancel(false)

      // When
      const denyProfessional = (): void => mission.denyProfessional('selectedProfessionalId')

      // Then
      expect(denyProfessional).toThrow()
    })
  })

  describe('When a professional refuses a mission', () => {
    it('should success with valid nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      mission.setProfessionalAsRefusingTheMission('selectedProfessionalId')

      // Then
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(false)
    })

    it('should fail with an inactive mission', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.cancel(false)

      // When
      const denyProfessional = (): MissionProfessionalEntry => mission.setProfessionalAsRefusingTheMission('selectedProfessionalId')

      // Then
      expect(denyProfessional).toThrow()
    })

    it('should fail with an unknown professional id', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const denyProfessional = (): MissionProfessionalEntry => mission.setProfessionalAsRefusingTheMission('unknownProfessionalId')

      // Then
      expect(denyProfessional).toThrow()
    })
  })

  describe('When a professional send a new proposal', () => {
    it('should success on valid state', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })

      // Then
      expect(mission.status).toBe(MissionStatuses.QUOTE_PENDING)
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(true)
    })

    it('should fail with a finished mission', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.cancel(false)

      // When
      const professionalSendingNewProposal = (): MissionProfessionalEntry =>
        mission.professionalSendNewProposal('selectedProfessionalId', {
          startDate: new Date(),
          pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
          quote: {
            tvaRate: 20,
            workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
            consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
            placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          },
        })

      // Then
      expect(professionalSendingNewProposal).toThrow()
    })
  })

  describe('When updating payment data', () => {
    it('should success with no actual payment data', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      const paymentData = { paymentId: 'paymentId', status: PaymentProviderStatuses.SUCCESS }

      // When
      mission.updatePaymentData(paymentData)

      // Then
      expect(mission.paymentData?.paymentIntentId).toBe(paymentData.paymentId)
      expect(mission.paymentData?.status).toBe(paymentData.status)
    })

    it('should success with an already existing payment data', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.updatePaymentData({ paymentId: 'firstPaymentId', status: PaymentProviderStatuses.WAITING_PAYMENT })
      const newPaymentData = { paymentId: 'paymentId', status: PaymentProviderStatuses.SUCCESS }

      // When
      mission.updatePaymentData(newPaymentData)

      // Then
      expect(mission.paymentData?.paymentIntentId).toBe(newPaymentData.paymentId)
      expect(mission.paymentData?.status).toBe(newPaymentData.status)
    })
  })

  describe('When starting a mission', () => {
    it('should success with nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })

      // When
      mission.start('selectedProfessionalId')

      // Then
      expect(mission.status).toBe(MissionStatuses.IN_PROGRESS)
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(true)
    })

    it('should fail when no proposal has been sent', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const startingMission = (): string[] => mission.start('selectedProfessionalId')

      // Then
      expect(startingMission).toThrow()
    })
  })

  describe('When finishing a mission', () => {
    it('should success with nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')

      // When
      mission.finish('selectedProfessionalId', 15000, [], ['Changement de serrure'])

      // Then
      expect(mission.status).toBe(MissionStatuses.FINISHED)
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(true)
    })

    it("should fail when the mission isn't in progress", () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const finishingMission = (): void => mission.finish('selectedProfessionalId', 15000, [], ['Changement de serrure'])

      // Then
      expect(finishingMission).toThrow()
    })
  })

  describe('When opening a dispute', () => {
    it('should success with nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')
      mission.finish('selectedProfessionalId', 15000, [], ['Changement de serrure'])
      const disputeReason = "parfum de l'arbre désodorisant utilisé a réduit la vitesse maximale du véhicule"

      // When
      mission.openDispute('clientId', disputeReason)

      // Then
      expect(mission.dispute).toBe(disputeReason)
    })

    it("should fail when the mission isn't finished", () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const finishingMission = (): void => mission.openDispute('clientId', 'La couleur de la voiture a changé')

      // Then
      expect(finishingMission).toThrow()
    })

    it('should fail when disputing as a wrong client', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      const finishingMission = (): void => mission.openDispute('wrongClientId', 'La couleur de la voiture a changé')

      // Then
      expect(finishingMission).toThrow()
    })
  })

  describe('When validating a mission by the client', () => {
    it('should success with nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')
      mission.finish('selectedProfessionalId', 15000, [], ['Changement de serrure'])

      const clientId = 'clientId'

      // When
      mission.validateByClient(clientId)

      // Then
      expect(mission.status).toBe(MissionStatuses.DELIVERED)
      expect(mission.getProfessionalEntry('selectedProfessionalId').active).toBe(true)
    })

    it('should fail when the wrong client', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')
      mission.finish('selectedProfessionalId', 15000, [], ['Changement de serrure'])

      const clientId = 'wrongClientId'

      // When
      const validatingMission = (): void => mission.validateByClient(clientId)

      // Then
      expect(validatingMission).toThrow()
    })
    it("should fail when the mission isn't finished", () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.professionalSendNewProposal('selectedProfessionalId', {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      })
      mission.start('selectedProfessionalId')
      const clientId = 'clientId'

      // When
      const validatingMission = (): void => mission.validateByClient(clientId)

      // Then
      expect(validatingMission).toThrow()
    })
  })

  describe('When cancelling a mission', () => {
    it('should success with nominal values', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])

      // When
      mission.cancel(true)

      // Then
      expect(mission.status).toBe(MissionStatuses.CANCELED)
      expect(mission.canceledByClient).toBe(true)
    })

    it('should fail when mission is already canceled', () => {
      // Given
      const mission = Mission.of(defaultClientRequest, ['professionalId', 'selectedProfessionalId'])
      mission.cancel(true)

      // When
      const cancellingMission = (): string[] => mission.cancel(true)

      // Then
      expect(cancellingMission).toThrow()
    })
  })
})
