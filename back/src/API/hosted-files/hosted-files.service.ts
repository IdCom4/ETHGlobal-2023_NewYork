import { Inject, Injectable, Logger } from '@nestjs/common'
import { IFileHostAPI } from '@Common/external-service-providers-api/file-host/file-host.api'
import { HostedFileReferenceRepository } from '@/repositories/hosted-file-reference.repository'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { ConfigService } from '@nestjs/config'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { InvoiceNotFoundException } from '@Common/exceptions/schemas/invoice/invoice-not-found.exception'

@Injectable()
export class HostedFilesService {
  private readonly _logger = new Logger(HostedFilesService.name)
  private readonly _DEVELOPMENT_FOLDER = 'development'

  constructor(
    @Inject('FileHostAPI') private readonly fileHostAPI: IFileHostAPI,
    private readonly hostedFileRepository: HostedFileReferenceRepository,
    private readonly configService: ConfigService
  ) {}

  /**
   * Delete a file from the file host and the database
   *
   * @param fileReferenceId The id of the file reference to delete
   */
  public async delete(fileReferenceId: string): Promise<void> {
    try {
      const hostedFileReference = await this.hostedFileRepository.findById(fileReferenceId).getOrNull()

      if (!hostedFileReference) return

      await this.fileHostAPI.delete(hostedFileReference)
      await this.hostedFileRepository.delete(fileReferenceId)
    } catch (e) {
      this._logger.error('Error: ', e)
    }
  }

  /**
   * Upload a file to the file host and save the file reference in the database.
   * @param file The file to upload
   * @param uploaderId The id of the user who uploaded the file
   * @param isPrivate Whether the file should be private or not, the owner of the file will be the uploader
   * @returns The file reference of the uploaded file
   */
  public async upload(file: TFile, uploaderId: string, isPrivate: boolean): Promise<HostedFileReference> {
    const header = file.content.split(',')[0]
    const fileExtension = header.split(':')[1].split(';')[0]
    const completeFileName = this.generateFileName(fileExtension, file.name)

    const baseHostURL = this.configService.get<string>('AWS_S3_BUCKET_URL')
    const containerName = this.configService.get<string>('AWS_S3_BUCKET_NAME')
    const privacyFolder = this.fileHostAPI.getPrivacyFolder(isPrivate)

    const fileUrl = `${baseHostURL}/${containerName}/${privacyFolder}/${completeFileName}`

    const hostedFileReference = HostedFileReference.of(fileUrl, completeFileName, fileExtension, uploaderId, isPrivate)

    await this.fileHostAPI.upload(file.content.split(',')[1], fileExtension, completeFileName, uploaderId, isPrivate)
    return await this.hostedFileRepository.create(hostedFileReference)
  }

  /**
   * Upload many files to the file host and save the file references in the database.
   *
   * @param files The files to upload
   * @param uploaderId The id of the user who uploaded the files
   * @param isPrivate Whether the files should be private or not, the owner of the files will be the uploader
   * @returns The file references of the uploaded files
   */
  public async uploadMany(files: TFile[], uploaderId: string, isPrivate: boolean): Promise<HostedFileReference[]> {
    const hostedFileReferences: HostedFileReference[] = []

    for (const file of files) {
      const uploadedFileReference = await this.upload(file, uploaderId, isPrivate)
      hostedFileReferences.push(uploadedFileReference)
    }

    return hostedFileReferences
  }

  // TODO: download file(s) with sanitizer if file isn't found
  /**
   * Download a file from the file host.
   * @param oldFileReferenceId The id of the file reference to delete
   * @param newFile The new file to upload
   * @param uploaderId The id of the user who uploaded the file
   * @param isPrivate Whether the file should be private or not, the owner of the file will be the uploader
   * @returns The file reference of the uploaded file
   * @throws {InternalServerErrorException} If an unknown error occurs during the file replacement
   */
  public async replaceFile(oldFileReferenceId: string | null, newFile: TFile, uploaderId: string, isPrivate: boolean): Promise<HostedFileReference> {
    const newHostedFile = await this.upload(newFile, uploaderId, isPrivate)

    if (oldFileReferenceId) {
      try {
        await this.delete(oldFileReferenceId)
      } catch (e) {
        await this.delete(newHostedFile._id.toString())
        throw new InternalServerErrorException('Un erreur inconnue est survenue lors de la mise à jour du fichier')
      }
    }
    return newHostedFile
  }

  /**
   * Get a hosted file in a base64 format by its id.
   *
   * @param requesterId Id of the requester.
   * Used to check if the requester is the owner of the file.
   * @param hostedFileId Id of the hosted file to get.
   * @returns Base64 file
   */
  public async getHostedFileById(requesterId: string, hostedFileId: string): Promise<TBase64File> {
    const hostedInvoiceReference: HostedFileReference = await this.hostedFileRepository
      .findById(hostedFileId)
      .getOrThrow(new InvoiceNotFoundException())

    if (hostedInvoiceReference.ownerId !== requesterId) throw new InvoiceNotFoundException()

    const base64File = await this.fileHostAPI.download(hostedInvoiceReference)
    if (!base64File) throw new InvoiceNotFoundException()

    return `data:${hostedInvoiceReference.fileExtension};base64,${base64File}`
  }

  /**
   * Get many hosted files in a base64 format by their ids.
   *
   * @param userId Id of the requester.
   * @param invoiceIds Ids of the hosted files to get.
   * @returns Base64 files
   */
  public async getHostedFilesById(userId: string, invoiceIds: string[]): Promise<TBase64File[]> {
    const hostedFileReferences: HostedFileReference[] = await this.hostedFileRepository
      .findMany({ _id: { $in: invoiceIds } })
      .getOrThrow(new InvoiceNotFoundException())

    if (hostedFileReferences.some((hostedFileReference) => hostedFileReference.ownerId !== userId)) throw new InvoiceNotFoundException()

    const base64Files: TBase64File[] = []

    for (const hostedFileReference of hostedFileReferences) {
      const base64File = await this.fileHostAPI.download(hostedFileReference)
      if (!base64File) throw new InvoiceNotFoundException()
      base64Files.push(base64File)
    }

    return base64Files
  }

  /**
   * Generate a file name with a timestamp based on the file extension and the base file name.
   *
   * @param fileExtension The file extension of the file
   * @param baseFileName The base file name of the file
   * @private
   * @returns The generated file name
   */
  private generateFileName(fileExtension: string, baseFileName?: string): string {
    const format = fileExtension.split('/')[1]
    const timestamp = Date.now()

    const fileName = `${timestamp}.${format}`
    const completeFileName = baseFileName ? `${baseFileName}.${fileName}` : fileName

    if (process.env.NODE_ENV !== 'production') return `${this._DEVELOPMENT_FOLDER}/${completeFileName}`

    return completeFileName
  }
}
