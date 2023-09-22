import { PublicFile } from '@Schemas/common/pojos'
import { Realisation } from '@Schemas/user'

describe('Schema - Realisation', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const id = 0
    const title = 'Titre'
    const description = 'Il a fait des trucs'
    const files = [new PublicFile('abc', 'def', 'png')]
    // When
    const realisation = new Realisation(id, title, description, files)

    // Then
    expect(realisation.id).toBe(id)
    expect(realisation.title).toBe(title)
    expect(realisation.description).toBe(description)
    expect(realisation.files).toBe(files)
  })

  it('should add a file', () => {
    // Given
    const realisation = new Realisation(0, 'Titre', 'Il a fait des trucs', [])
    const newFile = new PublicFile('35s1dffs', 'qds5q4d', 'png')

    // When
    realisation.addFile(newFile)

    // Then
    expect(realisation.files).toContain(newFile)
    expect(realisation.files.length).toBe(1)
  })

  it('should add multiple files', () => {
    // Given
    const realisation = new Realisation(0, 'Titre', 'Il a fait des trucs', [])
    const newFile1 = new PublicFile('1', 'ddbtd', 'png')
    const newFile2 = new PublicFile('2', 'qbstbsrtbds5q4d', 'png')
    const newFile3 = new PublicFile('3', 'sdtbsdbg', 'png')

    // When
    realisation.addFiles([newFile1, newFile2, newFile3])

    // Then
    expect(realisation.files).toContain(newFile1)
    expect(realisation.files).toContain(newFile2)
    expect(realisation.files).toContain(newFile3)
    expect(realisation.files.length).toBe(3)
  })

  it('should remove a file', () => {
    // Given
    const realisation = new Realisation(0, 'Titre', 'Il a fait des trucs', [])
    const newFile1 = new PublicFile('1', 'ddbtd', 'png')
    const newFile2 = new PublicFile('2', 'qbstbsrtbds5q4d', 'png')
    const newFile3 = new PublicFile('3', 'sdtbsdbg', 'png')
    realisation.addFiles([newFile1, newFile2, newFile3])

    // When
    realisation.removeFile('1')

    // Then
    expect(realisation.files).not.toContain(newFile1)
    expect(realisation.files).toContain(newFile2)
    expect(realisation.files).toContain(newFile3)
    expect(realisation.files.length).toBe(2)
  })

  it('should remove multiple files', () => {
    // Given
    const realisation = new Realisation(0, 'Titre', 'Il a fait des trucs', [])
    const newFile1 = new PublicFile('1', 'ddbtd', 'png')
    const newFile2 = new PublicFile('2', 'qbstbsrtbds5q4d', 'png')
    const newFile3 = new PublicFile('3', 'sdtbsdbg', 'png')
    realisation.addFiles([newFile1, newFile2, newFile3])

    // When
    realisation.removeFiles(['1', '2'])

    // Then
    expect(realisation.files).not.toContain(newFile1)
    expect(realisation.files).not.toContain(newFile2)
    expect(realisation.files).toContain(newFile3)
    expect(realisation.files.length).toBe(1)
  })

  it('should update realisation', () => {
    // Given
    const realisation = new Realisation(0, 'Titre', 'Il a fait des trucs', [new PublicFile('1', 'ddbtd', 'png')])
    const newTitle = 'Nouveau Titre'
    const newDescription = "Il a fait d'autres trucs"
    const newFiles = [new PublicFile('2', 'fghj', 'exe')]
    const realisationData = {
      title: newTitle,
      description: newDescription,
      files: newFiles,
    }

    // When
    realisation.update(realisationData)

    // Then
    expect(realisation.id).toBe(0)
    expect(realisation.title).toBe(newTitle)
    expect(realisation.description).toBe(newDescription)
    expect(realisation.files).toBe(newFiles)
  })
})
