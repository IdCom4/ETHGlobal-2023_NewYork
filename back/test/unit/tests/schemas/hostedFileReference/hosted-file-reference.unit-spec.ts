import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'
import { PublicFile } from '@/schemas/common/pojos'

describe('Schema - Hosted File Reference', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const fileURL = 'abc.de'
      const fileName = 'name'
      const fileExtension = 'png'
      const ownerId = '12345'
      const isPrivate = true

      // When
      const hostedFileReference = HostedFileReference.of(fileURL, fileName, fileExtension, ownerId, isPrivate)

      expect(hostedFileReference.fileURL).toBe(fileURL)
      expect(hostedFileReference.fileName).toBe(fileName)
      expect(hostedFileReference.fileExtension).toBe(fileExtension)
      expect(hostedFileReference.ownerId).toBe(ownerId)
      expect(hostedFileReference.isPrivate).toBe(isPrivate)
    })

    /*
      The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
     */
    it.each([
      /* eslint-disable prettier/prettier */
      {
        name: 'should fail with undefined fileUrl',
        fileUrl: undefined,
        fileName: 'name',
        fileExtension: 'png',
        ownerId: '12345',
        isPrivate: false
      },
      {
        name: 'should fail with undefined fileName',
        fileUrl: 'url.com',
        fileName: undefined,
        fileExtension: 'png',
        ownerId: '12345',
        isPrivate: false
      },
      {
        name: 'should fail with undefined fileExtension',
        fileUrl: 'url.com',
        fileName: 'name',
        fileExtension: undefined,
        ownerId: '12345',
        isPrivate: false
      },
      {
        name: 'should fail with undefined ownerId',
        fileUrl: 'url.com',
        fileName: 'name',
        fileExtension: 'png',
        ownerId: undefined,
        isPrivate: false
      },
      {
        name: 'should fail with undefined private state',
        fileUrl: 'url.com',
        fileName: 'name',
        fileExtension: 'png',
        ownerId: '12345',
        isPrivate: undefined
      }
      /* eslint-enable prettier/prettier */
    ])('$name', ({ fileUrl, fileName, fileExtension, ownerId, isPrivate }) => {
      // When
      // @ts-ignore
      const construct = (): HostedFileReference => HostedFileReference.of(fileUrl, fileName, fileExtension, ownerId, isPrivate)

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  describe('When getting associated public file instance', () => {
    it('should success with public hosted file reference', () => {
      // Given
      const fileURL = 'abc.de'
      const fileExtension = 'png'
      const hostedFileReference = HostedFileReference.of(fileURL, 'name', fileExtension, '12345', false)

      // When
      const publicFileFromReference = hostedFileReference.toPublicFile()

      expect(publicFileFromReference.fileReferenceId).toBe(hostedFileReference._id.toString())
      expect(publicFileFromReference.fileURL).toBe(fileURL)
      expect(publicFileFromReference.fileExtension).toBe(fileExtension)
    })

    it('should fail with private hosted file reference', () => {
      // Given
      const fileURL = 'abc.de'
      const fileExtension = 'png'
      const hostedFileReference = HostedFileReference.of(fileURL, 'name', fileExtension, '12345', true)

      // When
      const publicFileFromReference = (): PublicFile => hostedFileReference.toPublicFile()

      expect(publicFileFromReference).toThrowError()
    })
  })
})
