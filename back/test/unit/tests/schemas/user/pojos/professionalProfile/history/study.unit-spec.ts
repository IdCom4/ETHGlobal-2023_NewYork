import { LenientAddress } from '@Schemas/common/pojos'
import { IStudy, Study } from '@Schemas/user'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

describe('Schema - Study', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const id = 0
    const schoolName = 'Université de Paris'
    const schoolAddress = LenientAddress.of('123 Main Street', 'Anytown', '12345')
    const grade = 'Master'
    const description = "Bah en fait c'est un diplôme, voilà"
    const dateRange = FlexibleDateTimeRange.of(new Date(), new Date())

    // When
    const study = new Study(id, schoolName, schoolAddress, grade, description, dateRange)

    // Then
    expect(study.id).toBe(id)
    expect(study.schoolName).toBe(schoolName)
    expect(study.schoolAddress).toBe(schoolAddress)
    expect(study.grade).toBe(grade)
    expect(study.description).toBe(description)
    expect(study.dateRange).toBe(dateRange)
  })

  it('should update study', () => {
    // Given
    const study = new Study(
      0,
      'Université de Paris',
      LenientAddress.of('123 Main Street', 'Anytown', '12345'),
      'Master',
      "Bah en fait c'est un diplôme, voilà",
      FlexibleDateTimeRange.of(new Date(), new Date())
    )
    const newSchoolName = "Université d'autre part"
    const newSchoolAddress = LenientAddress.of('123 Second Street', 'Anytown', '12345')
    const newGrade = 'Doctorate'
    const newDescription = "Bah en fait c'est un autre diplôme, voilà voilà"
    const newDateRange = FlexibleDateTimeRange.of(new Date(), new Date())

    // When
    study.update({
      schoolName: newSchoolName,
      schoolAddress: newSchoolAddress,
      grade: newGrade,
      description: newDescription,
      dateRange: newDateRange,
    })

    // Then
    expect(study.id).toBe(0)
    expect(study.schoolName).toBe(newSchoolName)
    expect(study.schoolAddress).toBe(newSchoolAddress)
    expect(study.grade).toBe(newGrade)
    expect(study.description).toBe(newDescription)
    expect(study.dateRange).toBe(newDateRange)
  })

  it('should instantiate from data object', () => {
    // Given
    const studyData: IStudy = {
      id: 0,
      schoolName: 'Université de Paris',
      schoolAddress: LenientAddress.of('123 Main Street', 'Anytown', '12345'),
      grade: 'Master',
      description: "Bah en fait c'est un diplôme, voilà",
      dateRange: FlexibleDateTimeRange.of(new Date(), new Date()),
    }

    // When
    const study = Study.fromData(studyData)

    // Then
    expect(study.id).toBe(studyData.id)
    expect(study.schoolName).toBe(studyData.schoolName)
    expect(study.schoolAddress).toBe(studyData.schoolAddress)
    expect(study.grade).toBe(studyData.grade)
    expect(study.description).toBe(studyData.description)
    expect(study.dateRange).toBe(studyData.dateRange)
  })
})
