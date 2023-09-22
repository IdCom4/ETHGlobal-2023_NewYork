import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { AbstractBaseRepository } from '@/repositories/base/abstract.repository'
import { InstantiatingDataWrapper } from '@Common/classes'
import { Mission, MissionBlueprint } from '@/schemas/mission'

@Injectable()
export class MissionRepository extends AbstractBaseRepository<Mission, MissionBlueprint> {
  constructor(@InjectModel(Mission) model: ReturnModelType<typeof Mission>) {
    super(model, Mission)
  }

  public findAllByVehicleId(vehicleId: string): InstantiatingDataWrapper<Promise<Mission[]>, Mission> {
    return this.findMany({ '_clientRequest._vehicleId': vehicleId })
  }

  public findByIdAndClientId(missionId: string, clientId: string): InstantiatingDataWrapper<Promise<Mission>, Mission> {
    return this.findBy({ _id: missionId, '_clientRequest._clientId': clientId })
  }

  public findByIdAndProfessionalId(missionId: string, professionalId: string): InstantiatingDataWrapper<Promise<Mission>, Mission> {
    return this.findBy({ _id: missionId, '_professionalEntries._professionalId': { $eq: professionalId } })
  }
}
