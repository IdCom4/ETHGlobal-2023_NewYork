import { Box } from '@/schemas/box'
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { BoxBlueprint } from '@/schemas/box/box.blueprint'
import { BoxCategories } from '@/common/enums/schemas'
import { AbstractSoftDeletableRepository } from '@/repositories/base/abstract.repository'
import { InstantiatingDataWrapper } from '@Common/classes'

@Injectable()
export class BoxRepository extends AbstractSoftDeletableRepository<Box, BoxBlueprint> {
  constructor(@InjectModel(Box) model: ReturnModelType<typeof Box>) {
    super(model, Box)
  }

  public findAllActivesByCenterId(centerId: string): InstantiatingDataWrapper<Promise<Box[]>, Box> {
    return this.findManyActiveBy({ _centerId: centerId })
  }

  public findAllActivesByCenterIdAndCategory(centerId: string, category: BoxCategories): InstantiatingDataWrapper<Promise<Box[]>, Box> {
    return this.findManyActiveBy({ _centerId: centerId, _category: category })
  }
}
