import { Box } from '@/schemas/box'

export class BookingBoxResponse {
  id: string
  name: string
  type: string
  category: string

  constructor(box: Box) {
    this.id = box._id.toString()
    this.name = box.name
    this.type = box.type
    this.category = box.category
  }
}
