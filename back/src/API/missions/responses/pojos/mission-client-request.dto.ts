import { GuestVehicleResponse } from '@/API/vehicles/responses/vehicle.dto'
import { LiteUserResponse } from '@/common/request-io/responses-dto/user'
import { PublicFile, StrictAddress } from '@/schemas/common/pojos'
import { MissionClientRequest } from '@/schemas/mission/pojos'
import { User } from '@/schemas/user'
import { Vehicle } from '@/schemas/vehicle'
import { Expose, Type } from 'class-transformer'

export class MissionClientRequestResponse {
  /* eslint-disable prettier/prettier */
  @Expose()                             public client: LiteUserResponse
  @Expose()                             public vehicle: GuestVehicleResponse
  @Expose()                             public issueIds: string[]
  @Expose()                             public description: string
  @Expose()                             public idealStartingMoment: string
  @Expose() @Type(() => StrictAddress)  public idealPickupAddress: StrictAddress
  @Expose()                             public maxDistance: number
  @Expose()                             public hasSpareParts: boolean
  @Expose() @Type(() => PublicFile)     public attachments: PublicFile[]
  /* eslint-enable prettier/prettier */

  constructor(client: User, vehicleData: { vehicle: Vehicle; brandName: string }, request: MissionClientRequest) {
    this.client = new LiteUserResponse(client)
    this.vehicle = new GuestVehicleResponse(vehicleData.vehicle, vehicleData.brandName)
    this.issueIds = request.issueIds
    this.description = request.description
    this.idealStartingMoment = request.idealStartingMoment
    this.idealPickupAddress = request.idealPickupAddress
    this.maxDistance = request.maxDistance
    this.hasSpareParts = request.hasSpareParts
    this.attachments = request.attachments
  }
}
