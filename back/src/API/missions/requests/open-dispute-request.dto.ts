import { Length } from 'class-validator'

export class OpenDisputeRequest {
  @Length(10, 1000, {
    message: 'Votre message concernant les problèmes constatés à la finalisation de la mission doit faire entre 10 et 1000 caractères',
  })
  reason: string
}
