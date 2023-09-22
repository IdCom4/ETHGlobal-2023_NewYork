import { PublicFile, PublicFileBlueprint } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import '../../../../../extensions'

export interface IRealisation {
  id: number
  title: string
  description: string
  files: Array<PublicFile>
}

export class Realisation implements IRealisation {
  @prop({ type: Number, required: true })
  @Expose({ name: 'id' })
  protected readonly _id!: number

  @prop({ type: String, required: true })
  @Expose({ name: 'title' })
  protected _title!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'description' })
  protected _description!: string

  @prop({ type: Array<PublicFile>, required: true })
  @Type(() => PublicFile)
  @Expose({ name: 'files' })
  protected _files!: Array<PublicFile>

  constructor(id: number, title: string, description: string, files: Array<PublicFile>) {
    this._id = id
    this._title = title
    this._description = description
    this._files = files
  }

  /* ==== GETTERS & SETTERS ==== */
  /* eslint-disable prettier/prettier */
  public get id():                             number          { return this._id                 }
  public get title():                          string          { return this._title              }
  public set title(title: string)                              { this._title = title             }
  public get description():                    string          { return this._description        }
  public set description(description: string)                  { this._description = description }
  public get files():                          PublicFile[]    { return this._files              }
  public set files(files: PublicFile[])                        { this._files = files             }

  /* ==== FILES ==== */
  public addFile(file: PublicFile):                    void   { this.files.push(file)                                                           }
  public addFiles(files: PublicFile[]):                void   { files.forEach((file) => this.addFile(file))                                     }
  public removeFile(fileReferenceId: string):          void   { this.files.removeInPlace((file) => file.fileReferenceId === fileReferenceId)    }
  public removeFiles(fileReferenceIds: string[]):      void   { fileReferenceIds.forEach((fileReferenceId) => this.removeFile(fileReferenceId)) }
  /* eslint-enable prettier/prettier */

  update(data: Omit<IRealisation, 'id'>): void {
    this.title = data.title
    this.description = data.description
    this.files = data.files
  }

  static fromData(data: IRealisation): Realisation {
    return new Realisation(data.id, data.title, data.description, data.files)
  }
}

export abstract class RealisationBlueprint extends Realisation {
  _id: number
  _title: string
  _description: string
  _files: Array<PublicFileBlueprint>
}
