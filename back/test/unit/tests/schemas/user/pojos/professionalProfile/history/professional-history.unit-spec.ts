import { ProfessionalHistory } from '@Schemas/user'
import { PublicFile } from '@Schemas/common/pojos'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

describe('Schema - Professional History', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // When
    const professionalHistory = new ProfessionalHistory()

    // Then
    expect(professionalHistory.studies).toBeTruthy()
    expect(professionalHistory.professionalExperiences).toBeTruthy()
    expect(professionalHistory.realisations).toBeTruthy()
  })

  // >==== STUDY
  it('should add a single study', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addStudy({
      dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
      grade: 'Master',
      schoolName: 'University',
    })

    // Then
    expect(professionalHistory.studies.length).toBe(1)
  })

  it('should add multiple studies', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addStudies([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
    ])

    // Then
    expect(professionalHistory.studies.length).toBe(2)
  })

  describe('When updating a study', () => {
    it('should success with existing study', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addStudy({
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      })

      // When
      professionalHistory.updateStudy({
        id: 0,
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Doctorat',
        schoolName: 'Ouniversitie',
      })

      // Then
      expect(professionalHistory.studies[0].grade).toBe('Doctorat')
      expect(professionalHistory.studies[0].schoolName).toBe('Ouniversitie')
    })

    it('should fail with unknown study', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addStudy({
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      })

      // When
      const updatingStudy = (): void => {
        professionalHistory.updateStudy({
          id: 595995,
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          grade: 'Doctorat',
          schoolName: 'Ouniversitie',
        })
      }

      // Then
      expect(updatingStudy).toThrowError()
    })
  })

  it('should remove study', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addStudies([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
    ])

    // When
    professionalHistory.removeStudy(1)

    // Then
    expect(professionalHistory.studies.length).toBe(1)
  })

  it('should remove multiple studies', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addStudies([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        grade: 'Master',
        schoolName: 'University',
      },
    ])

    // When
    professionalHistory.removeStudies([0, 1])

    // Then
    expect(professionalHistory.studies.length).toBe(0)
  })
  // <==== STUDY

  // >==== PROFESSIONAL EXPERIENCE
  it('should add a professional experience', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addProfessionalExperience({
      dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
      enterprise: 'ValueMyCar',
      role: 'PDG',
    })

    // Then
    expect(professionalHistory.professionalExperiences.length).toBe(1)
  })

  it('should add a multiple professional experiences', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addProfessionalExperiences([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'PDG',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'AutreChose',
      },
    ])

    // Then
    expect(professionalHistory.professionalExperiences.length).toBe(2)
  })

  describe('When updating a professional experience', () => {
    it('should success with existing professional experience', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addProfessionalExperiences([
        {
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          enterprise: 'ValueMyCar',
          role: 'PDG',
        },
        {
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          enterprise: 'ValueMyCar',
          role: 'AutreChose',
        },
      ])

      // When
      professionalHistory.updateProfessionalExperience({
        id: 0,
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'Entreprise',
        role: 'Role',
      })

      // Then
      expect(professionalHistory.professionalExperiences[0].enterprise).toBe('Entreprise')
      expect(professionalHistory.professionalExperiences[0].role).toBe('Role')
    })

    it('should fail with unknown professional experience', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addProfessionalExperiences([
        {
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          enterprise: 'ValueMyCar',
          role: 'PDG',
        },
        {
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          enterprise: 'ValueMyCar',
          role: 'AutreChose',
        },
      ])

      // When
      const updatingProfessionalExperience = (): boolean => {
        professionalHistory.updateProfessionalExperience({
          id: 519681651,
          dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
          enterprise: 'Entreprise',
          role: 'Role',
        })

        return true
      }

      // Then
      expect(updatingProfessionalExperience).toThrowError()
    })
  })

  it('should remove a professional experience', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addProfessionalExperiences([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'PDG',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'AutreChose',
      },
    ])

    // When
    professionalHistory.removeProfessionalExperience(1)

    // Then
    expect(professionalHistory.professionalExperiences.length).toBe(1)
  })

  it('should add multiple professional experiences', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addProfessionalExperiences([
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'PDG',
      },
      {
        dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
        enterprise: 'ValueMyCar',
        role: 'AutreChose',
      },
    ])

    // When
    professionalHistory.removeProfessionalExperiences([0, 1])

    // Then
    expect(professionalHistory.professionalExperiences.length).toBe(0)
  })
  // <==== PROFESSIONAL EXPERIENCE

  // >==== REALISATION
  it('should add a realisation', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addRealisation({
      description: 'Truc',
      files: [new PublicFile('1', '5a4dad', 'png')],
      title: '',
    })

    // Then
    expect(professionalHistory.realisations.length).toBe(1)
  })

  it('should add multiple realisations', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()

    // When
    professionalHistory.addRealisations([
      { description: 'Truc', files: [new PublicFile('1', '5a4dad', 'png')], title: '' },
      { description: 'Machin', files: [new PublicFile('1', '5a4dad', 'png')], title: '' },
    ])

    // Then
    expect(professionalHistory.realisations.length).toBe(2)
  })

  describe('When updating realisations', () => {
    it('should success with existing realisation', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addRealisations([
        { description: 'Truc', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre1' },
        { description: 'Machin', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre2' },
      ])

      // When
      professionalHistory.updateRealisation({
        id: 0,
        description: 'Chose',
        files: [new PublicFile('1', '5dedea4dad', 'png')],
        title: 'Titre3',
      })

      // Then
      expect(professionalHistory.realisations[0].description).toBe('Chose')
      expect(professionalHistory.realisations[0].title).toBe('Titre3')
    })

    it('should fail with unknown realisation', () => {
      // Given
      const professionalHistory = new ProfessionalHistory()
      professionalHistory.addRealisations([
        { description: 'Truc', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre1' },
        { description: 'Machin', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre2' },
      ])

      // When
      const updatingProfessionalExperience = (): boolean => {
        professionalHistory.updateRealisation({
          id: 684681165,
          description: 'Chose',
          files: [new PublicFile('1', '5dedea4dad', 'png')],
          title: 'Titre3',
        })

        return true
      }

      // Then
      expect(updatingProfessionalExperience).toThrowError()
    })
  })

  it('should remove a realisations', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addRealisations([
      { description: 'Truc', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre1' },
      { description: 'Machin', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre2' },
    ])

    // When
    professionalHistory.removeRealisation(1)

    // Then
    expect(professionalHistory.realisations.length).toBe(1)
  })

  it('should remove multiple realisations', () => {
    // Given
    const professionalHistory = new ProfessionalHistory()
    professionalHistory.addRealisations([
      { description: 'Truc', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre1' },
      { description: 'Machin', files: [new PublicFile('1', '5a4dad', 'png')], title: 'Titre2' },
    ])

    // When
    professionalHistory.removeRealisations([0, 1])

    // Then
    expect(professionalHistory.realisations.length).toBe(0)
  })
  // <==== REALISATION
})
