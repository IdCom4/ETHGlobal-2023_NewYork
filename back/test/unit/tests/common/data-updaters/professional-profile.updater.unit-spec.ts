import { ProfessionalProfileUpdater } from '@Common/data-updaters/professionnal-profile.updater'
import { instance, mock, when } from 'ts-mockito'
import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { ProfessionalUser, Study, User } from '@Schemas/user'
import { LenientAddress, StrictAddress } from '@Schemas/common/pojos'
import { FlexibleDateTimeRangeDTO, LenientAddressDTO, StrictAddressDTO } from '@/common/request-io/request-dto'
import '@/extensions'
import { FlexibleDateTimeRange } from '@Schemas/common/pojos/date/flexible-date-time-range'

describe('Updater - ProfessionalProfileUpdater', () => {
  let professionalProfileUpdater: ProfessionalProfileUpdater

  beforeAll(() => {
    const mockedHostedFilesServiceClass = mock(HostedFilesService)
    const mockedHostedFileServiceInstance = instance(mockedHostedFilesServiceClass)
    when(mockedHostedFilesServiceClass.upload).thenReturn(async (file, uploaderId, isPrivate) =>
      HostedFileReference.of(file.content, file.name || 'name', 'png', uploaderId, isPrivate)
    )
    when(mockedHostedFilesServiceClass.uploadMany).thenReturn(
      async function (files, uploaderId, isPrivate): Promise<HostedFileReference[]> {
        const hostedFileReferences: HostedFileReference[] = []

        for (const file of files) {
          const uploadedFileReference = await this.upload(file, uploaderId, isPrivate)
          hostedFileReferences.push(uploadedFileReference)
        }

        return hostedFileReferences
      }.bind(mockedHostedFileServiceInstance)
    )
    when(mockedHostedFilesServiceClass.upload).thenReturn(async (file, uploaderId, isPrivate) =>
      HostedFileReference.of(file.content, file.name || 'name', 'png', uploaderId, isPrivate)
    )
    when(mockedHostedFilesServiceClass.delete).thenReturn(() => Promise.resolve())
    when(mockedHostedFilesServiceClass.replaceFile).thenReturn(async (oldFileReferenceId, newFile, uploaderId, isPrivate) =>
      HostedFileReference.of(newFile.content, newFile.name || 'name', 'png', uploaderId, isPrivate)
    )

    professionalProfileUpdater = new ProfessionalProfileUpdater(mockedHostedFileServiceInstance)
  })

  describe('When updating a professional profile', () => {
    it('should fail with a not professional user', async () => {
      // Given
      const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456')

      // When
      const updatingUser = async (): Promise<void> => await professionalProfileUpdater.update(user, ['businessName'], { businessName: 'test' })

      // Then
      await expect(updatingUser).rejects.toThrow()
    })

    describe('When providing a professional user', () => {
      it('should success with simple changes', async () => {
        // Given
        const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
          skillIds: ['some-skill-id'],
          workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
        })
        const newDatas = {
          businessName: 'test',
          businessPicture: '514d6fq5d4fqsdf',
          averageHourlyRate: 1234,
          businessPresentation: "J'ai une nouvelle présentation !",
        }

        // When
        await professionalProfileUpdater.update(user, ['businessName', 'businessPicture', 'averageHourlyRate', 'businessPresentation'], newDatas)

        // Then
        const userProfessionalProfile = user.professionalProfile
        expect(userProfessionalProfile.businessName).toBe(newDatas.businessName)
        expect(userProfessionalProfile.businessPicture?.fileURL).toBe(newDatas.businessPicture)
        expect(userProfessionalProfile.averageHourlyRate).toBe(newDatas.averageHourlyRate)
        expect(userProfessionalProfile.businessPresentation).toBe(newDatas.businessPresentation)
      })

      it('should success with complete changes', async () => {
        // Given
        const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
          skillIds: ['some-skill-id'],
          workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
        })
        const newData = {
          businessName: 'test',
          businessPicture: '514d6fq5d4fqsdf',
          averageHourlyRate: 1234,
          businessPresentation: "J'ai une nouvelle présentation !",
          maxTravelDistance: 4321,
          averageAvailability: "Le matin, mais j'aime bien les frites",
          workAddress: Object.initClassByReflection(StrictAddressDTO, {
            street: '123 Main Street',
            city: 'Anytown',
            zipCode: '12345',
            coordinates: [1.5, 1.2] as [number, number],
          }),
          company: {
            siret: '123 456 789 01234',
            legalForm: 'LLC',
            denomination: 'ABC LLC',
            legalAddress: Object.initClassByReflection(StrictAddressDTO, {
              street: '123 Main Street',
              city: 'Anytown',
              zipCode: '12345',
              coordinates: [1.5, 1.2] as [number, number],
            }),
            naf: '7022Z',
          },
          realisations: [
            {
              newFiles: ['a52d4f5zdf4', 'qs2df4qs2d4f'],
              title: 'TitreRealisation',
              description: 'DescriptionRealisation',
              files: [],
            },
          ],
          professionalExperiences: [
            {
              enterprise: 'ValueMyCar',
              role: "Chasseur d'iceberg",
              dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, {
                begin: new Date(1234548494651),
                end: new Date(123454849465114),
              }),
            },
          ],
          studies: [
            {
              schoolName: 'Université de quelque part',
              schoolAddress: Object.initClassByReflection(LenientAddressDTO, {
                street: '1234 Second Street',
                city: 'Anothertown',
                zipCode: '13245',
              }),
              grade: 'Licence en conception de Pastis',
              description: 'Je fais du Pastis. Mais je le fais bien !',
              dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, {
                begin: new Date(1234548494651),
                end: new Date(123454849465114),
              }),
            },
          ],
          skillIds: ['qs65df4qsf64qsf', '254dzfqdf4qf4'],
          curriculum: '65qs1df6qsf4q6sd54',
          insurance: '3ds54v1fsd63v8f41sdv',
        }

        // When
        await professionalProfileUpdater.update(
          user,
          [
            'businessName',
            'businessPicture',
            'businessPresentation',
            'averageHourlyRate',
            'maxTravelDistance',
            'averageAvailability',
            'workAddress',
            'company',
            'realisations',
            'professionalExperiences',
            'studies',
            'skillIds',
            'curriculum',
            'insurance',
          ],
          newData
        )

        // Then
        const userProfessionalProfile = user.professionalProfile
        expect(userProfessionalProfile.businessName).toBe(newData.businessName)
        expect(userProfessionalProfile.businessPicture?.fileURL).toBe(newData.businessPicture)
        expect(userProfessionalProfile.averageHourlyRate).toBe(newData.averageHourlyRate)
        expect(userProfessionalProfile.businessPresentation).toBe(newData.businessPresentation)
        expect(userProfessionalProfile.maxTravelDistance).toBe(newData.maxTravelDistance)
        expect(userProfessionalProfile.averageAvailability).toBe(newData.averageAvailability)
        expect(userProfessionalProfile.company?.siret).toEqual(newData.company.siret)
        expect(userProfessionalProfile.skillIds).toBe(newData.skillIds)
        expect(userProfessionalProfile.curriculum?.fileURL).toBe(newData.curriculum)
        expect(userProfessionalProfile.insurance?.fileURL).toBe(newData.insurance)

        const userProfessionalHistory = userProfessionalProfile.history
        expect(userProfessionalHistory.realisations.length).toBe(1)
        expect(userProfessionalHistory.realisations[0].id).toBe(0)
        expect(userProfessionalHistory.realisations[0].title).toBe(newData.realisations[0].title)
        expect(userProfessionalHistory.professionalExperiences.length).toBe(1)
        expect(userProfessionalHistory.professionalExperiences[0].id).toBe(0)
        expect(userProfessionalHistory.professionalExperiences[0].role).toBe(newData.professionalExperiences[0].role)
        expect(userProfessionalHistory.studies.length).toBe(1)
        expect(userProfessionalHistory.studies[0].id).toBe(0)
        expect(userProfessionalHistory.studies[0].grade).toBe(newData.studies[0].grade)
      })

      describe('When modifying particular study', () => {
        it('should success with existing study', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addStudy(
            new Study(
              0,
              'Université',
              LenientAddress.of('d', 'd', 'd'),
              'testeur de toboggan',
              'Je teste des toboggans',
              FlexibleDateTimeRange.of(new Date(56464), new Date(9797))
            )
          )
          /**
           *           new Study(
           *             0,
           *             'Université',
           *             LenientAddress.of('d', 'd', 'd'),
           *             'testeur de toboggan',
           *             'Je teste des toboggans',
           *             new DateRange(new Date(56464), new Date(9797))
           *           )
           */
          const updatedStudy = {
            id: 0,
            schoolName: 'Université de quelque part',
            schoolAddress: Object.initClassByReflection(LenientAddressDTO, {
              street: '1234 Second Street',
              city: 'Anothertown',
              zipCode: '13245',
            }),
            grade: 'Licence en conception de Pastis',
            description: 'Je fais du Pastis. Mais je le fais bien !',
            dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, {
              begin: new Date(1234548494651),
              end: new Date(123454849465114),
            }),
          }
          // When
          await professionalProfileUpdater.update(user, ['studies'], { studies: [updatedStudy] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.studies.length).toBe(1)
          expect(professionalHistory.studies[0].schoolName).toBe(updatedStudy.schoolName)
          expect(professionalHistory.studies[0].schoolAddress?.city).toBe(updatedStudy.schoolAddress.city)
          expect(professionalHistory.studies[0].schoolAddress?.street).toBe(updatedStudy.schoolAddress.street)
          expect(professionalHistory.studies[0].schoolAddress?.zipCode).toBe(updatedStudy.schoolAddress.zipCode)
          expect(professionalHistory.studies[0].grade).toBe(updatedStudy.grade)
          expect(professionalHistory.studies[0].description).toBe(updatedStudy.description)
        })

        it('should modify nothing with unknown study', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addStudy(
            new Study(
              0,
              'Université',
              LenientAddress.of('d', 'd', 'd'),
              'testeur de toboggan',
              'Je teste des toboggans',
              FlexibleDateTimeRange.of(new Date(56464), new Date(9797))
            )
          )
          const updatedStudy = {
            id: 8542,
            schoolName: 'Université de quelque part',
            schoolAddress: Object.initClassByReflection(LenientAddressDTO, {
              street: '1234 Second Street',
              city: 'Anothertown',
              zipCode: '13245',
            }),
            grade: 'Licence en conception de Pastis',
            description: 'Je fais du Pastis. Mais je le fais bien !',
            dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, {
              begin: new Date(1234548494651),
              end: new Date(123454849465114),
            }),
          }
          // When
          await professionalProfileUpdater.update(user, ['studies'], { studies: [updatedStudy] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.studies.length).toBe(0)
        })
      })

      describe('When modifying particular professional experience', () => {
        it('should success with existing professional experience', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addProfessionalExperience({
            enterprise: 'ValiouMaïKar',
            role: 'Verbicruciste',
            dateRange: FlexibleDateTimeRange.of(new Date(12354), new Date(65432)),
          })
          const updatedProfessionalExperience = {
            id: 0,
            enterprise: 'ValueMyCar',
            role: 'Professeur de yoga canin',
            dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, { begin: new Date(12354), end: new Date(65432) }),
          }
          // When
          await professionalProfileUpdater.update(user, ['professionalExperiences'], { professionalExperiences: [updatedProfessionalExperience] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.professionalExperiences.length).toBe(1)
          expect(professionalHistory.professionalExperiences[0].id).toBe(updatedProfessionalExperience.id)
          expect(professionalHistory.professionalExperiences[0].enterprise).toBe(updatedProfessionalExperience.enterprise)
          expect(professionalHistory.professionalExperiences[0].role).toBe(updatedProfessionalExperience.role)
        })

        it('should modify nothing with unknown study', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addProfessionalExperience({
            enterprise: 'ValiouMaïKar',
            role: 'Verbicruciste',
            dateRange: FlexibleDateTimeRange.of(new Date(12354), new Date(65432)),
          })

          const updatedProfessionalExperience = {
            id: 98465,
            enterprise: 'ValueMyCar',
            role: "Éleveur d'insectes comestibles",
            dateRange: Object.initClassByReflection(FlexibleDateTimeRangeDTO, { begin: new Date(12354), end: new Date(65432) }),
          }

          // When
          await professionalProfileUpdater.update(user, ['professionalExperiences'], { professionalExperiences: [updatedProfessionalExperience] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.studies.length).toBe(0)
        })
      })

      describe('When modifying particular realisation', () => {
        it('should success with existing realisation', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addRealisation({
            title: 'Laver les murs',
            description: "J'ai nettoyé les murs avec du dentifrice",
            files: [],
          })
          const updatedRealisation = {
            id: 0,
            newFiles: [],
            title: 'Laver le sol',
            description: "J'ai nettoyé le sol avec du dentifrice",
            files: [],
          }
          // When
          await professionalProfileUpdater.update(user, ['realisations'], { realisations: [updatedRealisation] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.realisations.length).toBe(1)
          expect(professionalHistory.realisations[0].id).toBe(updatedRealisation.id)
          expect(professionalHistory.realisations[0].title).toBe(updatedRealisation.title)
          expect(professionalHistory.realisations[0].description).toBe(updatedRealisation.description)
        })

        it('should modify nothing with unknown realisation', async () => {
          // Given
          const user = <ProfessionalUser>User.of('John', 'Doe', '0612345678', 'john@doe.fr', '123456', {
            skillIds: ['some-skill-id'],
            workAddress: StrictAddress.of('7 rue saint Jean', 'Aubusson', '23200', [0, 0]),
          })
          user.professionalProfile.history.addRealisation({
            title: 'Laver les murs',
            description: "J'ai nettoyé les murs avec du dentifrice",
            files: [],
          })
          const updatedRealisation = {
            id: 987654,
            newFiles: [],
            title: 'Laver le sol',
            description: "J'ai nettoyé le sol avec du dentifrice",
            files: [],
          }

          // When
          await professionalProfileUpdater.update(user, ['realisations'], { realisations: [updatedRealisation] })

          // Then
          const professionalHistory = user.professionalProfile.history
          expect(professionalHistory.studies.length).toBe(0)
        })
      })
    })
  })
})
