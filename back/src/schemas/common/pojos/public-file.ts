import { Expose, Type } from 'class-transformer'
import { prop } from '@typegoose/typegoose'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { ForbiddenException } from '@nestjs/common/exceptions'

export class PublicFile {
  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileReferenceId' })
  protected _fileReferenceId!: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileURL' })
  protected _fileURL!: string

  @prop({ type: String, required: true })
  @Type(() => String)
  @Expose({ name: 'fileExtension' })
  protected _fileExtension!: string

  constructor(fileReferenceId: string, fileURL: string, fileExtension: string) {
    this._fileReferenceId = fileReferenceId
    this._fileURL = fileURL
    this._fileExtension = fileExtension
  }

  /* >==== GETTER & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  public get fileReferenceId(): string  { return this._fileReferenceId  }
  public get fileURL():         string  { return this._fileURL          }
  public get fileExtension():   string  { return this._fileExtension    }
  /* eslint-enable prettier/prettier */

  static fromHostedFileReference(hostedFileReference: HostedFileReference): PublicFile {
    if (hostedFileReference.isPrivate) throw new ForbiddenException('Vous ne pouvez pas convertir un fichier privé en fichier public')
    return new PublicFile(hostedFileReference._id.toString(), hostedFileReference.fileURL, hostedFileReference.fileExtension)
  }
}

export abstract class PublicFileBlueprint extends PublicFile {
  _fileReferenceId!: string
  _fileURL!: string
  _fileExtension!: string
}
