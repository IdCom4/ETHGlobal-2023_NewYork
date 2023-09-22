import { Issue } from '@Schemas/issue/issue.schema'
import { IssueBlueprint } from '@Schemas/issue/issue.blueprint'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { InstantiatingDataWrapper } from '@Common/classes'

@Injectable()
export class IssueRepository extends AbstractBaseRepository<Issue, IssueBlueprint> {
  constructor(@InjectModel(Issue) model: ReturnModelType<typeof Issue>) {
    super(model, Issue)
  }

  public searchByLabel(label: string): InstantiatingDataWrapper<Promise<Issue[]>, Issue> {
    return this.findMany({ _label: label })
  }
}
