import { IsBase64File } from '@/common/class-operations/validators'
import { IsMongoId, IsNotEmpty, IsOptional, Length } from 'class-validator'

export class MessageRequest {
  @IsNotEmpty({ message: "L'Id du destinataire est requise" })
  @IsMongoId({ message: "L'Id du destinataire doit avoir un format valide d'Id" })
  receiverId: string

  @IsOptional()
  @Length(0, 5000, { message: 'Le texte du message doit faire entre 0 et 5000 caractères' })
  content?: string

  @IsOptional()
  @IsBase64File({ message: 'La pièce jointe doit être au format base64' })
  attachment?: TBase64File
}
