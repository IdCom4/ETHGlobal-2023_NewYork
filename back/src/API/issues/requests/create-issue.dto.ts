import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsMongooseId } from '@Common/class-operations/validators/mongoose-id.validator'

export class CreateIssueRequest {
  @ApiProperty({ example: 'Pneu crevé', description: "Label de l'issue", required: true })
  @IsNotEmpty({ message: 'Le label est requis' })
  label: string

  @ApiProperty({ description: "Id des compétences requis pour l'issue", required: true })
  @IsOptional()
  @IsMongooseId({ each: true })
  skillIds: string[]
}
