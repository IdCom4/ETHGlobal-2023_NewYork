import { ArrayMinSize, IsEnum, IsNotEmpty, IsOptional, Min, ValidateNested } from 'class-validator'
import { MissionQuoteProductDTO } from './mission-quote-product.dto'
import { RequestAllowedTVARates } from '@/common/enums'
import { Type } from 'class-transformer'

export class MissionQuoteDTO {
  @IsNotEmpty({ message: "Le taux d'assujetissement à la TVA est requis" })
  @IsEnum(RequestAllowedTVARates, {
    message: `Le taux d'assujetissement à la TVA doit être valide. (valeurs autorisées: ${Object.values(RequestAllowedTVARates).join(' | ')})`,
  })
  @Min(0, { message: "Le taux d'assujetissement à la TVA  du devis ne peut pas être négatif" })
  tvaRate: number

  @IsNotEmpty({ message: "Vous devez renseigner au moins une opération de main d'oeuvre" })
  @ArrayMinSize(1, { message: "Vous devez renseigner au moins une opération de main d'oeuvre" })
  @Type(() => MissionQuoteProductDTO)
  @ValidateNested({ each: true })
  workForces: MissionQuoteProductDTO[]

  @IsOptional()
  @Type(() => MissionQuoteProductDTO)
  @ValidateNested({ each: true })
  consumables: MissionQuoteProductDTO[] = []

  @IsOptional()
  @Type(() => MissionQuoteProductDTO)
  @ValidateNested({ each: true })
  placeAndEquipments: MissionQuoteProductDTO[] = []
}
