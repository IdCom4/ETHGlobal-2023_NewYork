import { HostedFileReference } from '@Schemas/hostedFileReference/hosted-file-reference.schema'
import mongoose from 'mongoose'

/**
 * [HostedFileReference](./hosted-file-reference.schema.ts)
 *
 * Blueprints are used to ensure that the properties's name are well written when used within mongo's queries.
 * Those models must be kept up to date with their schema counterpart
 */
export abstract class HostedFileReferenceBlueprint extends HostedFileReference {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  _fileURL: string
  _fileName: string
  _fileExtension: string
  _ownerId: string
  _isPrivate: boolean
}
