import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { TimestampedDBDocument } from '@/schemas/db-document.abstract-schema'
import { PublicFile } from '@Schemas/common/pojos'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { IllegalArgumentException } from '@Common/exceptions/illegal-argument.exception'

@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { timestamps: true } })
export class HostedFileReference extends TimestampedDBDocument {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileURL' })
  protected _fileURL: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileName' })
  protected _fileName: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileExtension' })
  protected _fileExtension: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'ownerId' })
  protected _ownerId: string

  @prop({ type: Boolean, required: true })
  @Type(() => Boolean)
  @Expose({ name: 'isPrivate' })
  protected _isPrivate: boolean

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  constructor() {
    super()
  }

  public static of(fileURL: string, fileName: string, fileExtension: string, ownerId: string, isPrivate: boolean): HostedFileReference {
    const hostedFileReference = new HostedFileReference()
    hostedFileReference.initialize(fileURL, fileName, fileExtension, ownerId, isPrivate)

    return hostedFileReference
  }

  protected initialize(fileURL: string, fileName: string, fileExtension: string, ownerId: string, isPrivate: boolean): void {
    HostedFileReference.validateInputs(fileURL, fileName, fileExtension, ownerId, isPrivate)

    this._fileURL = fileURL
    this._fileName = fileName
    this._fileExtension = fileExtension
    this._ownerId = ownerId
    this._isPrivate = isPrivate
  }

  /**
   * Convert this {@link HostedFileReference} to a {@link PublicFile}.
   */
  toPublicFile(): PublicFile {
    if (this._isPrivate) throw new ForbiddenException('Vous ne pouvez pas convertir un fichier privé en fichier public')
    return PublicFile.fromHostedFileReference(this)
  }

  private static validateInputs(fileURL: string, fileName: string, fileExtension: string, ownerId: string, isPrivate: boolean): void {
    if (!fileURL) throw new IllegalArgumentException("File Reference's URL cannot be undefined")
    if (!fileName) throw new IllegalArgumentException("File Reference's name cannot be undefined")
    if (!fileExtension) throw new IllegalArgumentException("File Reference's extension cannot be undefined")
    if (!ownerId) throw new IllegalArgumentException("File Reference's owner's Id cannot be undefined")
    if (isPrivate == null) throw new IllegalArgumentException("File Reference's private state cannot be undefined")
  }
  /* <==== INIT ====< */

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get fileURL():       string  { return this._fileURL       }
  public get fileName():      string  { return this._fileName      }
  public get fileExtension(): string  { return this._fileExtension }
  public get ownerId():       string  { return this._ownerId       }
  public get isPrivate():     boolean { return this._isPrivate     }
  /* eslint-enable prettier/prettier */
}
