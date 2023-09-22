import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Passports } from '@Common/enums/requests-io'

/**
 * This is an alias to our custom `'local'` (represented by `Passport.CREDENTIAL` key) AuthGuard implementation.
 * The `'local'` key strategy refers to an authentication system using a username (renamed `'email'`
 * to match our system architecture) and a password to verify user identity. Is it one of the
 * build-in strategies from Passport.js library.
 * (package: `passport-local`)
 *
 * <p>The actual implementation of the authentication is in the [CredentialsStrategy](../../strategies/credentials/credentials.strategy.ts) class,
 * which is automatically referenced via the `'local'` name.
 * {@link https://docs.nestjs.com/recipes/passport}
 *
 * <p>Sending Credentials in Request Body:
 * To authenticate with this strategy, send a POST request to the authentication endpoint
 * with the credentials (username and password) in the request body. The request must
 * include a JSON object containing the 'email' and 'password' fields:
 * ```
 * {
 *   "email": "user_email",
 *   "password": "user_password"
 * }
 * ```
 *
 * <p>Usage:
 * To protect a route using this guard, simply add it to the route definition:
 * ```
 * @UseGuards(CredentialsAuthGuard)
 * @Get('endpoint')
 * async protectedRoute() {
 *   return { message: 'You are connected !'};
 * }
 * ```
 */
@Injectable()
export class CredentialsAuthGuard extends AuthGuard(Passports.CREDENTIALS) {}
