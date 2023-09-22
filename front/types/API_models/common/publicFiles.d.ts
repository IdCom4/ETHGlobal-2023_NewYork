export {}

declare global {
  interface IPublicFile {
    fileReferenceId: string
    fileURL: string
    fileExtension: string
    content?: TBase64File
  }
  interface IFileUpload {
    content: TBase64File
    fileURL?: string
    name: string
  }
}
