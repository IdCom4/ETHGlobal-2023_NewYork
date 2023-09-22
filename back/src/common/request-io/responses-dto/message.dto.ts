import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class MessageResponse {
  @ApiProperty({ description: 'Status code de la réponse', example: 200 })
  @Expose()
  readonly statusCode: number

  @ApiProperty({ description: 'Message de la réponse', example: 'Utilisateur enregistré' })
  @Expose()
  readonly message: string

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode
    this.message = message
  }
}
