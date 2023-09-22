import { IsOptional, Length } from 'class-validator'

export class UpdatePrivateNoteRequest {
  @IsOptional()
  @Length(0, 10000, { message: 'Le note privée ne doit pas dépasser 10 000 caractères' })
  privateNote = ''
}
