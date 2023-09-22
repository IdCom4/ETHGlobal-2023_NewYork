import { StrictAddressDTO } from '@/common/request-io/request-dto'
import { MissionQuoteDTO } from './pojos'
import { ParseStringDate } from '@/common/class-operations/validators'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class NewMissionProfessionalProposalRequest {
  @IsNotEmpty({ message: 'Vous devez préciser une date de prise en charge du véhicule' })
  @ParseStringDate('dd/MM/yyyy HH:mm', { message: 'Vous devez donner une date valide' })
  startDate: Date

  @IsNotEmpty({ message: 'Vous devez renseigner une adresse de prise en charge du véhicule' })
  @Type(() => StrictAddressDTO)
  @ValidateNested()
  pickupAddress: StrictAddressDTO

  @IsNotEmpty({ message: 'Vous devez renseigner un devis' })
  @Type(() => MissionQuoteDTO)
  @ValidateNested()
  quote: MissionQuoteDTO
}
