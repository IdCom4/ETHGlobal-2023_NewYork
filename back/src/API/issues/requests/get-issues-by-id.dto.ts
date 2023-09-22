import { ArrayNotEmpty, IsMongoId } from 'class-validator'

export class GetIssuesByIdRequest {
  @ArrayNotEmpty({ message: 'Vous devez renseigner au moins un problème à récupérer' })
  @IsMongoId({ each: true, message: 'Vous devez renseigner des ID au bon format' })
  issueIds: string[] = []
}
