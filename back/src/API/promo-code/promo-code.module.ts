import { PromoCodeRepository } from '@/repositories/promo-code.repository'
import { PromoCode } from '@/schemas/promo-code'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypegooseModule } from 'nestjs-typegoose'
import { PromoCodesController } from './promo-code.controller'
import { PromoCodesService } from './promo-code.service'

@Module({
  imports: [TypegooseModule.forFeature([PromoCode])],
  exports: [PromoCodesService, PromoCodeRepository, TypegooseModule.forFeature([PromoCode])],
  providers: [PromoCodesController, PromoCodesService, PromoCodeRepository],
  controllers: [PromoCodesController],
})
export class PromoCodesModule {}
