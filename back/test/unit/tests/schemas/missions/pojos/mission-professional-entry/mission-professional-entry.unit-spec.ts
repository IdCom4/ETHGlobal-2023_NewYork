import { MissionProfessionalEntry } from '@Schemas/mission'
import { PublicFile, StrictAddress } from '@Schemas/common/pojos'
import { MissionProposalStatuses } from '@Common/enums'

describe('Schema - MissionProfessionalEntry', () => {
  it('should instantiate when instantiating with all arguments constructor and nominal values', () => {
    // Given
    const professionalId = 'professionalId'

    // When
    const missionQuoteProduct = MissionProfessionalEntry.of(professionalId)

    // Then
    expect(missionQuoteProduct.professionalId).toBe(professionalId)
    expect(missionQuoteProduct.privateNote).toBeUndefined()
    expect(missionQuoteProduct.proposal).toBeUndefined()
    expect(missionQuoteProduct.messages).toHaveLength(0)
    expect(missionQuoteProduct.active).toBe(true)
  })

  it('should change private notes', () => {
    // Given
    const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
    const privateNote = 'privateNote'

    // When
    missionProfessionalEntry.updatePrivateNote(privateNote)

    // Then
    expect(missionProfessionalEntry.privateNote).toBe(privateNote)
  })

  it('should set the new proposal', () => {
    // Given
    const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
    const newProposal = {
      startDate: new Date(),
      pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
      quote: {
        tvaRate: 20,
        workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
      },
    }

    // When
    missionProfessionalEntry.setNewProposal(newProposal.startDate, newProposal.pickupAddress, newProposal.quote)

    // Then
    expect(missionProfessionalEntry.proposal).toBeDefined()
    expect(missionProfessionalEntry.proposal?.status).toBe('SENT')
    expect(missionProfessionalEntry.proposal?.quote.tvaRate).toBe(20)
  })

  describe('When set the professional entry as chosen', () => {
    it('should success with valid entry', () => {
      // Given
      const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
      const newProposal = {
        startDate: new Date(),
        pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
        quote: {
          tvaRate: 20,
          workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
          placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        },
      }
      missionProfessionalEntry.setNewProposal(newProposal.startDate, newProposal.pickupAddress, newProposal.quote)

      // When
      missionProfessionalEntry.setAsChosen()

      // Then
      expect(missionProfessionalEntry.proposal?.status).toBe(MissionProposalStatuses.ACCEPTED)
    })

    it('should fail with an inactive entry', () => {
      // Given
      const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
      missionProfessionalEntry.setInactive()

      // When
      const choosing = (): void => missionProfessionalEntry.setAsChosen()

      // Then
      expect(choosing).toThrow()
    })

    it('should success with no proposal', () => {
      // Given
      const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')

      // When
      const choosing = (): void => missionProfessionalEntry.setAsChosen()

      // Then
      expect(choosing).toThrow()
    })
  })

  it('should deny proposal when setting entry as inactive', () => {
    // Given
    const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
    const newProposal = {
      startDate: new Date(),
      pickupAddress: StrictAddress.of('123 Main Street', 'Anytown', '12345', [1, 1]),
      quote: {
        tvaRate: 20,
        workForces: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        consumables: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
        placeAndEquipments: [{ description: 'description', quantity: 123, unitPriceHT: 456 }],
      },
    }
    missionProfessionalEntry.setNewProposal(newProposal.startDate, newProposal.pickupAddress, newProposal.quote)

    // When
    missionProfessionalEntry.setInactive()

    // Then
    expect(missionProfessionalEntry.active).toBe(false)
    expect(missionProfessionalEntry.proposal?.status).toBe(MissionProposalStatuses.DENIED)
  })

  it('should deny proposal when setting entry as inactive', () => {
    // Given
    const missionProfessionalEntry = MissionProfessionalEntry.of('professionalId')
    const content = 'content'
    const attachment = new PublicFile('url', 'filename', 'imagine/png')
    const bySystem = false
    const senderId = 'senderId'
    const receiverId = 'receiverId'

    // When
    missionProfessionalEntry.newMessage(content, attachment, bySystem, senderId, receiverId)

    // Then
    expect(missionProfessionalEntry.messages).toHaveLength(1)
    expect(missionProfessionalEntry.messages[0].content).toBe(content)
  })
})
