import { Formula } from '@/schemas/box'
import { IsNotEmpty, IsPositive, Length } from 'class-validator'

export class FormulaDTO {
  @IsNotEmpty({ message: "L'intitulé de la formule est requis" })
  @Length(2, 50, { message: "L'intitulé de la formule doit faire entre 2 et 50 caractères" })
  label: string

  @IsNotEmpty({ message: "La durée en quart d'heure de la formule est requise" })
  @IsPositive({ message: "La durée en quart d'heure de la formule doit être un nombre positif" })
  nbrQuarterHour: number

  @IsNotEmpty({ message: 'Le prix de la formule est requis' })
  @IsPositive({ message: 'Le prix de la formule doit être un nombre positif' })
  price: number

  public toFormula(): Formula {
    return Formula.of(this.label, this.nbrQuarterHour, this.price)
  }
}
