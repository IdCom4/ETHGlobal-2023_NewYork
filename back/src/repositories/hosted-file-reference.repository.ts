import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import { HostedFileReferenceBlueprint } from '@/schemas/hostedFileReference'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'

@Injectable()
export class HostedFileReferenceRepository extends AbstractBaseRepository<HostedFileReference, HostedFileReferenceBlueprint> {
  constructor(@InjectModel(HostedFileReference) model: ReturnModelType<typeof HostedFileReference>) {
    super(model, HostedFileReference)
  }
}
