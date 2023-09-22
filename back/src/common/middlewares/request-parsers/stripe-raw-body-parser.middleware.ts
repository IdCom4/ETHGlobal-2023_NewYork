import * as cloneBuffer from 'clone-buffer'
import { Request } from 'express'
import { TParserVerify } from '@Common/middlewares/request-parsers/base'

/**
 * This middleware is used to store the raw body of the request in the request object.
 * This is used to capture body for Stripe signature verification:
 * By capturing the raw body, we can verify the signature of the request.
 *
 * @param request The request object.
 * @param _ // unused
 * @param buffer The buffer containing the raw body of the request.
 * @returns {boolean} Always returns true.
 */
export const stripeRawBodyParser: TParserVerify = (request: Request & { rawBody: string | Buffer }, _, buffer: Buffer): boolean => {
  // important to store rawBody for Stripe signature verification
  if (request.headers['stripe-signature'] && Buffer.isBuffer(buffer)) request.rawBody = cloneBuffer(buffer)
  return true
}
