import { IsNotEmpty, Length, Min } from 'class-validator'

export class MissionQuoteProductDTO {
  @IsNotEmpty({ message: "La description d'un élement de devis est requise" })
  @Length(3, 100000, { message: "La description d'un élément du devis doit faire entre 3 et 10 000 caractères" })
  description: string

  @IsNotEmpty({ message: "La quantité d'un élément du devis est requise" })
  @Min(0.1, { message: "La quantité d'un élément du devis ne peut pas être inférieur à 0.1" })
  quantity: number

  @IsNotEmpty({ message: "Le prix unitaire HT d'un élément du devis est requise" })
  @Min(0.1, { message: "Le prix unitaire HT d'un élément du devis ne peut pas être inférieur à 0.1" })
  unitPriceHT: number
}
