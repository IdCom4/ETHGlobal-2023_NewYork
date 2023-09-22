import { ConvertPojoToInstance } from '@/common/classes'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationPipeOptions } from '@nestjs/common'
import { validate } from 'class-validator'

/**
 * Represents a NestJS PipeTransform service class that validates data in the body of an incoming request.
 *
 * It acts as middleware, intercepting and validating
 * the request body before it is processed by route handlers.
 *
 * The `transform` method is the core of this class.
 * It extracts the metadata and body from the incoming request.
 * If the body is not an object, or no validation rules are defined, it simply returns the request.
 * Otherwise, it converts the body into an
 * instance of the specified class and validates it against defined rules (if any).
 *
 * If the validation fails, a `BadRequestException` is thrown with the validation error messages.
 * If it passes, the request object is returned with the validated body.
 *
 * Usage:
 * This service is typically used in a route handler's pipeline
 * to ensure that the request body data conforms to validation
 * rules before processing.
 */
@Injectable()
export class ValidateBodyFromRequest implements PipeTransform {
  constructor(private readonly options?: ValidationPipeOptions) {}

  async transform(request: IRequest<object>, metadata: ArgumentMetadata): Promise<IRequest<unknown>> {
    const { metatype } = metadata

    // If the incoming data is not an object or the validation rules are not defined, return the value as is
    if (!request.body || !metatype || metatype !== Object || !request.bodyType) return request

    const validatedBodyInstance = ConvertPojoToInstance.convert(request.body, { targetClass: request.bodyType })
    const errors = await validate(validatedBodyInstance, this.options)

    if (errors.length) {
      // If validation fails, throw a BadRequestException with the error messages
      const errorMessage = errors.map((error) => Object.values(error.constraints || [])).join(', ')
      throw new BadRequestException(errorMessage)
    }

    return { ...request, body: validatedBodyInstance }
  }
}
