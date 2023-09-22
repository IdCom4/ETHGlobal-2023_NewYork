import { PublicFile } from '@/schemas/common/pojos'
import { IsNotEmpty, Length } from 'class-validator'

export class PublicFileDTO {
  @IsNotEmpty()
  @Length(24, 24)
  fileReferenceId!: string

  @IsNotEmpty()
  @Length(10, 150)
  fileURL!: string

  @IsNotEmpty()
  @Length(1, 50)
  fileExtension!: string

  public toPublicFile(): PublicFile {
    return new PublicFile(this.fileReferenceId, this.fileURL, this.fileExtension)
  }
}
