import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Passports } from '@Common/enums'

/**
 * This is an alias to our custom `'admin-local'` (represented by `Passport.CREDENTIALS_ADMIN` key) AuthGuard implementation.
 * The `'admin-local'` key strategy refers to an authentication system using a username (renamed `'email'`
 * to match our system architecture) and a password to verify user identity and match only for admin users.
 *
 * <p>The actual implementation of the authentication is in the [AdminCredentialsStrategy](../../strategies/credentials/admin-credentials.strategy.ts) class.
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
 * @UseGuards(AdminCredentialsAuthGuard)
 * @Get('endpoint')
 * async protectedRoute() {
 *   return { message: 'You are connected !'};
 * }
 * ```
 */
@Injectable()
export class AdminCredentialsAuthGuard extends AuthGuard(Passports.CREDENTIALS_ADMIN) {}
