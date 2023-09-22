import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FilesPrivacyFolders } from '@Common/enums/external-APIs'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { S3Wrapper } from '@Common/external-service-providers-api/file-host/s3.wrapper'

/**
 * Represents the behavior of all file host API
 * and so abstract the implementation details of each possible file host API.
 *
 * A file host API is the entry point to an external file host service.
 * It is used to upload, download, delete, move, and list files.
 */
export interface IFileHostAPI {
  /**
   * Uploads a file to the file host.
   * @param {String} base64File    The base64 encoded file content.
   * @param {String} fileExtension The file extension.
   * @param {String} fileName      The name of the file.
   * @param {String} uploaderId    The ID of the uploader.
   * @param {boolean} isPrivate    Indicates whether the file should be private or public.
   * @returns A Promise that resolves when the upload is successful.
   */
  upload(base64File: string, fileExtension: string, fileName: string, uploaderId: string, isPrivate: boolean): Promise<void>

  /**
   * Downloads a file from the file host.
   * @param {HostedFileReference} hostedFile The reference to the hosted file.
   * @returns A Promise that resolves with the base64 encoded content of the downloaded file,
   * or null if the file does not exist or cannot be accessed.
   */
  download(hostedFile: HostedFileReference): Promise<string | null>

  /**
   * Deletes a file from the file host.
   * @param {HostedFileReference} hostedFile The reference to the hosted file.
   * @returns A Promise that resolves when the file is successfully deleted.
   */
  delete(hostedFile: HostedFileReference): Promise<void>

  /**
   * Moves a file to a new path in the file host.
   * @param {HostedFileReference} hostedFile The reference to the hosted file.
   * @param {String} newPath                 The new path for the file.
   * @returns A Promise that resolves when the file is successfully moved.
   */
  move(hostedFile: HostedFileReference, newPath: string): Promise<void>

  /**
   * Lists all files in a specified folder.
   * @param {String} folder The folder path.
   * @returns A Promise that resolves with an array of file names in the specified folder,
   * or null if the folder does not exist or cannot be accessed.
   */
  listAll(folder: string): Promise<(TFileName | undefined)[] | null>

  /**
   * Gets the folder path based on the privacy setting.
   * @param {boolean} isPrivate Indicates whether the folder should be private or public.
   * @returns The folder path for the specified privacy setting.
   */
  getPrivacyFolder(isPrivate: boolean): string
}

/**
 * Implementation of {@link IFileHostAPI} for the AWS S3 API.
 * It uses the {@link S3Wrapper} to communicate with the AWS S3 API.
 */
@Injectable()
export class AWSS3API implements IFileHostAPI {
  private readonly logger = new Logger(AWSS3API.name)
  private readonly s3: S3Wrapper

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Wrapper(configService)
  }

  public async upload(base64File: string, fileExtension: string, fileName: string, uploaderId: string, isPrivate: boolean): Promise<void> {
    const privacyFolder = this.getPrivacyFolder(isPrivate)

    const uploadObjectRequest = {
      Body: Buffer.from(base64File, 'base64'),
      Key: `${privacyFolder}/${fileName}`,
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      ContentDisposition: 'inline',
      ContentType: fileExtension,
      // If the file is private, we don't want to set the ACL to public-read.
      // It will only let the API download it.
      ACL: isPrivate ? '' : 'public-read',
    }

    try {
      await this.s3.putObject(uploadObjectRequest)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Une erreur inconnue est survenue lors du téléchargement de votre fichier')
    }
  }

  public async delete(hostedFile: HostedFileReference): Promise<void> {
    const privacyFolder = this.getPrivacyFolder(hostedFile.isPrivate)

    const deleteObjectRequest = {
      Key: `${privacyFolder}/${hostedFile.fileName}`,
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
    }

    try {
      await this.s3.deleteObject(deleteObjectRequest)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la suppression de votre fichier')
    }
  }

  public async download(hostedFile: HostedFileReference): Promise<string | null> {
    const privacyFolder = this.getPrivacyFolder(hostedFile.isPrivate)

    const downloadObjectRequest = {
      Key: `${privacyFolder}/${hostedFile.fileName}`,
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
    }

    try {
      return await this.s3.getFile(downloadObjectRequest)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Une erreur inconnue est survenue lors de la récupération de votre fichier')
    }
  }

  public async move(hostedFile: HostedFileReference, newPath: string): Promise<void> {
    const fileToMove: TBase64File | null = await this.download(hostedFile)

    if (!fileToMove) return

    await this.upload(fileToMove, hostedFile.fileExtension, `${newPath}/${hostedFile.fileName}`, hostedFile.ownerId, hostedFile.isPrivate)
    await this.delete(hostedFile)
  }

  public async listAll(folder: string): Promise<(TFileName | undefined)[] | null> {
    const listObjectsRequest = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      prefix: folder,
    }

    try {
      return this.s3.getFileNameList(listObjectsRequest)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Une erreur inconnue est survenue du listage des fichiers')
    }
  }

  public getPrivacyFolder(isPrivate: boolean): string {
    return isPrivate ? FilesPrivacyFolders.PRIVATE : FilesPrivacyFolders.PUBLIC
  }
}
