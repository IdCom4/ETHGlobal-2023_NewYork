import { HostedFilesService } from '@Api/hosted-files/hosted-files.service'
import { instance, mock, when } from 'ts-mockito'
import { IFileHostAPI } from '@Common/external-service-providers-api'
import { HostedFileReferenceRepository } from '@/repositories'
import { ConfigService } from '@nestjs/config'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { InstantiatingDataWrapper } from '@Common/classes'

describe('Service - HostedFilesService', () => {
  let hostedFilesService: HostedFilesService

  beforeAll(() => {
    const mockedFileHostAPIClass = mock<IFileHostAPI>()
    when(mockedFileHostAPIClass.download).thenReturn(async () => 'fileContent')

    const mockedConfigServiceClass = mock(ConfigService)
    const mockedHostedFileRepositoryClass = mock(HostedFileReferenceRepository)
    when(mockedHostedFileRepositoryClass.findById).thenReturn((fileId) => {
      if (fileId == 'existingFileId')
        return InstantiatingDataWrapper.fromData(Promise.resolve(HostedFileReference.of(fileId, 'naïme', 'png', 'ownerId', true)))
      return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<HostedFileReference>)
    })
    when(mockedHostedFileRepositoryClass.create).thenReturn(async (instance) => instance)
    when(mockedHostedFileRepositoryClass.findMany).thenReturn(({ _id }) => {
      if ((_id as { $in: string[] }).$in.includes('existingFileId1') && (_id as { $in: string[] }).$in.includes('existingFileId2')) {
        return InstantiatingDataWrapper.fromData(
          Promise.resolve([
            HostedFileReference.of('existingFileId1', 'name1', 'png', 'ownerId', true),
            HostedFileReference.of('existingFileId2', 'name2', 'png', 'ownerId', true),
          ])
        )
      }
      return InstantiatingDataWrapper.fromData(Promise.resolve(null) as unknown as Promise<HostedFileReference[]>)
    })

    hostedFilesService = new HostedFilesService(
      instance(mockedFileHostAPIClass),
      instance(mockedHostedFileRepositoryClass),
      instance(mockedConfigServiceClass)
    )
  })

  it('should success when deleting hosted file', async () => {
    // Given
    const fileReferenceId = 'existingFileId'

    // When
    const deletingFile = async (): Promise<void> => await hostedFilesService.delete(fileReferenceId)

    // Then
    await expect(deletingFile()).resolves.not.toThrow()
  })

  it('should return uploaded hosted file reference when uploading new file', async () => {
    // Given
    const uploaderId = '654654654'
    const file: TFile = {
      content:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      name: 'foto2profil',
    }

    // When
    const uploadedFile = await hostedFilesService.upload(file, uploaderId, false)

    // Then
    expect(uploadedFile).toBeTruthy()
    expect(uploadedFile.fileURL).toBeTruthy()
    expect(uploadedFile.fileName).toBeTruthy()
    expect(uploadedFile.fileExtension).toBe('image/png')
    expect(uploadedFile.ownerId).toBe(uploaderId)
    expect(uploadedFile.isPrivate).toBe(false)
  })

  it('should return all uploaded hosted file references when uploading many new file', async () => {
    // Given
    const uploaderId = '654654654'
    const files: TFile[] = [
      {
        content:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        name: 'foto2profil',
      },
      {
        content: 'data:image/png;base64,SGVsbG8sIFdvcmxkIQ==',
        name: 'enkoruneimage',
      },
    ]

    // When
    const uploadedFile = await hostedFilesService.uploadMany(files, uploaderId, false)

    // Then
    expect(uploadedFile).toBeTruthy()
    expect(uploadedFile[0]).toBeTruthy()
    expect(uploadedFile[0].fileURL).toBeTruthy()
    expect(uploadedFile[0].fileName).toBeTruthy()
    expect(uploadedFile[0].fileExtension).toBe('image/png')
    expect(uploadedFile[0].ownerId).toBe(uploaderId)
    expect(uploadedFile[0].isPrivate).toBe(false)
    expect(uploadedFile[1]).toBeTruthy()
    expect(uploadedFile[1].fileURL).toBeTruthy()
    expect(uploadedFile[1].fileName).toBeTruthy()
    expect(uploadedFile[1].fileExtension).toBe('image/png')
    expect(uploadedFile[1].ownerId).toBe(uploaderId)
    expect(uploadedFile[1].isPrivate).toBe(false)
  })

  describe('When replacing a file', () => {
    it('should return new file with a given old file', async () => {
      // Given
      const oldFileReferenceId = '654654'
      const newFile: TFile = {
        content:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        name: 'foto2profil',
      }
      const uploaderId = '99999'

      // When
      const replacedFile = await hostedFilesService.replaceFile(oldFileReferenceId, newFile, uploaderId, false)

      // Then
      expect(replacedFile).toBeTruthy()
      expect(replacedFile._id.toString()).not.toBe(oldFileReferenceId)
      expect(replacedFile.fileURL).toBeTruthy()
      expect(replacedFile.fileName).toBeTruthy()
      expect(replacedFile.fileExtension).toBe('image/png')
      expect(replacedFile.ownerId).toBe(uploaderId)
      expect(replacedFile.isPrivate).toBe(false)
    })

    it('should return new file with no old file', async () => {
      // Given
      const newFile: TFile = {
        content:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        name: 'foto2profil',
      }
      const uploaderId = '99999'

      // When
      const replacedFile = await hostedFilesService.replaceFile(null, newFile, uploaderId, false)

      // Then
      expect(replacedFile).toBeTruthy()
      expect(replacedFile._id.toString()).toBeTruthy()
      expect(replacedFile.fileURL).toBeTruthy()
      expect(replacedFile.fileName).toBeTruthy()
      expect(replacedFile.fileExtension).toBe('image/png')
      expect(replacedFile.ownerId).toBe(uploaderId)
      expect(replacedFile.isPrivate).toBe(false)
    })
  })

  describe('When getting a hosted file', () => {
    it('should success with nominal values', async () => {
      // Given
      const requesterId = 'ownerId'
      const fileReferenceId = 'existingFileId'

      // When
      const gettingFile = await hostedFilesService.getHostedFileById(requesterId, fileReferenceId)

      // Then
      expect(gettingFile).toBeTruthy()
    })

    it('should fail with unknown file reference id', async () => {
      // Given
      const requesterId = 'ownerId'
      const fileReferenceId = 'unknownFileId'

      // When
      const gettingFile = async (): Promise<string> => await hostedFilesService.getHostedFileById(requesterId, fileReferenceId)

      // Then
      await expect(gettingFile).rejects.toThrow()
    })

    it('should fail with unknown requester id', async () => {
      // Given
      const requesterId = 'unknownRequesterId'
      const fileReferenceId = 'existingFileId'

      // When
      const gettingFile = async (): Promise<string> => await hostedFilesService.getHostedFileById(requesterId, fileReferenceId)

      // Then
      await expect(gettingFile).rejects.toThrow()
    })
  })

  describe('When getting hosted files by id', () => {
    it('should success with nominal values', async () => {
      // Given
      const userId = 'ownerId'
      const invoiceIds = ['existingFileId1', 'existingFileId2']

      // When
      const gettingFiles = await hostedFilesService.getHostedFilesById(userId, invoiceIds)

      // Then
      expect(gettingFiles).toBeTruthy()
      expect(gettingFiles.length).toEqual(invoiceIds.length)
    })

    it('should fail with unknown invoice ids', async () => {
      // Given
      const userId = 'ownerId'
      const invoiceIds = ['unknownFileId1', 'unknownFileId2']

      // When
      const gettingFiles = async (): Promise<string[]> => await hostedFilesService.getHostedFilesById(userId, invoiceIds)

      // Then
      await expect(gettingFiles).rejects.toThrow()
    })

    it('should fail with mismatched owner id', async () => {
      // Given
      const userId = 'unknownUserId'
      const invoiceIds = ['existingFileId1', 'existingFileId2']

      // When
      const gettingFiles = async (): Promise<string[]> => await hostedFilesService.getHostedFilesById(userId, invoiceIds)

      // Then
      await expect(gettingFiles).rejects.toThrow()
    })
  })
})
