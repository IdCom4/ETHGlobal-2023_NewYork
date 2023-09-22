import { Center } from '@/schemas/center'

export class BookingCenterResponse {
  id: string
  name: string

  constructor(center: Center) {
    this.id = center._id.toString()
    this.name = center.name
  }
}
