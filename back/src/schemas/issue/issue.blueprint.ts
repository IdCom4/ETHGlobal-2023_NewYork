import { Issue } from './issue.schema'
import mongoose from 'mongoose'

export abstract class IssueBlueprint extends Issue {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _label: string
  _skillIds: string[]
}
