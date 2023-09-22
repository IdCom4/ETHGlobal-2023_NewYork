import { PromoCodeBlueprint, PromoCode } from '@/schemas/promo-code'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { InstantiatingDataWrapper } from '@Common/classes'

@Injectable()
export class PromoCodeRepository extends AbstractBaseRepository<PromoCode, PromoCodeBlueprint> {
  public constructor(@InjectModel(PromoCode) model: ReturnModelType<typeof PromoCode>) {
    super(model, PromoCode)
  }

  public findByLabel(label: string): InstantiatingDataWrapper<Promise<PromoCode>, PromoCode> {
    return this.findBy({ _label: label })
  }
}
