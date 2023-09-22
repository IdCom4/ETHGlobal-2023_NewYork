import { PublicFile } from '@Schemas/common/pojos'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'

describe('Schema - Public File', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const fileReferenceId = '56s341fc'
    const fileURL = 'abc.de'
    const fileExtension = 'png'
    // When
    const publicFile = new PublicFile(fileReferenceId, fileURL, fileExtension)

    expect(publicFile.fileReferenceId).toBe(fileReferenceId)
    expect(publicFile.fileURL).toBe(fileURL)
    expect(publicFile.fileExtension).toBe(fileExtension)
  })

  describe('When instantiating from hosted file reference instance', () => {
    it('should instantiate with public hosted file reference', () => {
      // Given
      const fileURL = 'abc.de'
      const fileExtension = 'png'
      const hostedFileReference = HostedFileReference.of(fileURL, 'name', fileExtension, '12345', false)

      // When
      const publicFileFromReference = PublicFile.fromHostedFileReference(hostedFileReference)

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
      const publicFileFromReference = (): PublicFile => PublicFile.fromHostedFileReference(hostedFileReference)

      expect(publicFileFromReference).toThrowError()
    })
  })
})
