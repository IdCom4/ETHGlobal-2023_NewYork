import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Passports } from '@Common/enums/requests-io'

/**
 * This is an alias to our custom `'jwt'` (represented by `Passport.JWT` key) AuthGuard implementation.
 * The `'jwt'`key strategies refers to an authentication system using a JSON Web Token (JWT) to verify user
 * identity. Is it one of the build-in strategies from Passport.js library.
 * (package: `passport-local`)
 *
 * <p>The actual implementation of the authentication is in the (JwtStrategy)[../strategies/jwt/jwt.strategy.ts] class,
 * which is automatically referenced via the `'jwt'` name.
 * {@link https://docs.nestjs.com/recipes/passport}
 *
 * <p>Sending JWT in `'Authorization'` Header:
 * To authenticate with this strategies, send a request to a protected endpoint with the JWT
 * included in the `'Authorization'` Header.
 * The given JWT must be prefixed by the type `'Bearer'` as follows:
 * ```
 * Authorization: Bearer <JWT>
 * ```
 *
 * <p>Usage:
 * To protect a route using this guard, simply add it to the route definition:
 * ```
 * @UseGuards(JwtAuthGard)
 * @Get('endpoint')
 * async protectedRoute() {
 *   return { message: 'You are connected !'};
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(Passports.JWT) {}
