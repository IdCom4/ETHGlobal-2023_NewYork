import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'

/**
 * @deprecated Not used anymore.
 * HTTP route param decorator that extracts the request object from the context and wraps it in a custom object
 */
export const RequestWrapper = createParamDecorator(<T extends object>(data: TClassConstructor<T>, ctx: ExecutionContext): IRequest<T> => {
  const request: ExpressRequest = ctx.switchToHttp().getRequest()
  return { headers: request.headers, query: request.query, params: request.params, body: request.body, bodyType: data }
})
