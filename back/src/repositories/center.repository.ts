import { Center, CenterBlueprint } from '@Schemas/center'
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { AbstractSoftDeletableRepository } from '@/repositories/base/abstract.repository'
import { InstantiatingDataWrapper } from '@Common/classes'

@Injectable()
export class CenterRepository extends AbstractSoftDeletableRepository<Center, CenterBlueprint> {
  constructor(@InjectModel(Center) model: ReturnModelType<typeof Center>) {
    super(model, Center)
  }

  public findByName(name: string): InstantiatingDataWrapper<Promise<Center>, Center, undefined, undefined> {
    return this.findBy({ _name: name })
  }
}
