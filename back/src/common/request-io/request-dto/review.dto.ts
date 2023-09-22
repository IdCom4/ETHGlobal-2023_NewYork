import { Review } from '@/schemas/common/pojos'
import { User } from '@/schemas/user'
import { IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator'

export class ReviewDTO {
  @IsNumber(undefined, { message: 'La note doit être un chiffre' })
  @Min(0, { message: 'La note ne peut pas être inférieure à 0' })
  @Max(5, { message: 'La note ne peut pas être supérieure à 5' })
  rating: number

  @IsOptional()
  @IsString({ message: 'Le commentaire doit être textuel' })
  @Length(0, 500, { message: 'Le commentaire doit faire entre 0 et 500 caractères' })
  comment?: string

  public toReview(reviewer: User): Review {
    return new Review(this.rating, new Date(), reviewer._id.toString(), reviewer.name, this.comment)
  }
}
