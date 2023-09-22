import { TTransformFunction, TTransformFunctionParams } from './base'
import { ObjectId } from 'mongoose'

/**
 * Transform ObjectId to string
 * Is used in class-transformer decorators.
 */
export const objectIdToString: TTransformFunction<ObjectId, string> = (source: TTransformFunctionParams<ObjectId>): string => {
  return source.obj[source.key].toString()
}
