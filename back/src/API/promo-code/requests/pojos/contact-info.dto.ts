import { ContactInfo } from '@/schemas/promo-code/pojos'
import { IsNotEmpty, Length } from 'class-validator'

export class ContactInfoDTO {
  @IsNotEmpty({ message: 'Le nom du bénéficiaire est requis' })
  @Length(2, 50, { message: 'Le nom du bénéficiaire doit faire entre 2 et 50 caractères' })
  name: string

  @IsNotEmpty({ message: 'Le nom de famille du bénéficiaire est requis' })
  @Length(2, 50, { message: 'Le nom de famille du bénéficiaire doit faire entre 2 et 50 caractères' })
  lastName: string

  @IsNotEmpty({ message: "L'adresse email du bénéficiaire est requise" })
  @Length(2, 50, { message: "L'adresse email du bénéficiaire doit faire entre 2 et 50 caractères" })
  email: string

  @IsNotEmpty({ message: 'Le numéro de téléphone du bénéficiaire est requis' })
  @Length(2, 20, { message: 'Le numéro de téléphone du bénéficiaire doit faire entre 2 et 20 caractères' })
  phone: string

  public toContactInfo(): ContactInfo {
    return ContactInfo.of(this.name, this.lastName, this.phone, this.email)
  }
}
