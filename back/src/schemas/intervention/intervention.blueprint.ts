import { Intervention } from './intervention.schema'

export abstract class InterventionBlueprint extends Intervention {
  createdAt: Date
  updatedAt: Date
  _label: string
  _category: string
}
