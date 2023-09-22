import { StrictAddressDTO } from '@/common/request-io/request-dto'
import { Type } from 'class-transformer'
import { ArrayMinSize, IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator'

export class RegisterProfessionalData {
  @IsNotEmpty({ message: 'Vous devez renseigner au moins une compétence' })
  @ArrayMinSize(1, { message: 'Vous devez renseigner au moins une compétence' })
  skillIds: string[]

  @ValidateNested()
  @Type(() => StrictAddressDTO)
  @IsNotEmptyObject({}, { message: "L'adresse de travail doit être renseignée" })
  workAddress: StrictAddressDTO
}
