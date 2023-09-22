import { Module } from '@nestjs/common'
import { LocalMapAPI } from './map.api'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [{ provide: 'MapAPI', useClass: LocalMapAPI }],
  exports: [HttpModule, { provide: 'MapAPI', useClass: LocalMapAPI }],
})
export class MapAPIModule {}
