import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshRequest {
  @ApiProperty({ description: 'Token de rafraichissement', required: true })
  @IsNotEmpty({ message: 'Vous devez renseigner un refresh token.' })
  refreshToken: string
}
