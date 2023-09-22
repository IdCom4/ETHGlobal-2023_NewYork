/* FILE UPLOAD */

class FilesUtils {
  static getCompleteFileExtension(fileUrl: string) {
    console.log({ fileUrl })
    const fileFormat = fileUrl
      .split('')
      .reverse()
      .join('')
      .split('.')[0]
      .split('')
      .reverse()
      .join('')
    if (['PNG', 'JPEG', 'JPG', 'GIF', 'WEBP', 'BITMAP', 'TIFF', 'HEIC'].includes(fileFormat.toUpperCase())) return 'image/' + fileFormat
    else if (['MP4', 'AVI', 'MOV', 'WMV', 'WEBM', 'FLV', 'MPEG', 'MKV', 'OGG'].includes(fileFormat.toUpperCase())) return 'video/' + fileFormat
    return 'document/' + fileFormat
  }

  static getFileExtension(file: string): string | null {
    const fileData = /.*\.(\w+)/g.exec(file.toLowerCase())
    if (!fileData || !fileData[1]) return null

    return fileData[1]
  }

  static isVideo(file: string): boolean {
    const extension = FilesUtils.getFileExtension(file)
    return (extension && ['mp4', 'ogg'].includes(extension)) as boolean
  }

  static isImage(file: string): boolean {
    const extension = FilesUtils.getFileExtension(file)
    return (extension && ['jpeg', 'jpg', 'png'].includes(extension)) as boolean
  }

  // TODO: remove this method and rework the components & logics using it
  // ! when a file is uploaded, it must be sent as a base64 string to the API,
  // ! that will create a public file out it
  // ! there is no exception to this behavior, and the front must never create a public file
  static convertFileToPublicFile(files: File[]): IPublicFile[] {
    const publicFiles: IPublicFile[] = []

    files.forEach((f) => {
      publicFiles.push({
        fileReferenceId: publicFiles.length.toString(),
        fileURL: URL.createObjectURL(f),
        fileExtension: useUtils().files.getFileExtension(f.name) || ''
      })
    })

    return publicFiles
  }

  static getFileAsBase64(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.addEventListener('loadend', () => {
        const base64result = reader.result

        if (base64result && typeof base64result === 'string') {
          resolve(base64result)
        } else {
          resolve(null)
        }
      })

      if (file) {
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  }
}

export default FilesUtils
