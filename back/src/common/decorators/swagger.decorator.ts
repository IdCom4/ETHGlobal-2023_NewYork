import { ApiBody, ApiHeader } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import { AuthType } from '@Common/enums/auth-type.enum'
import { LoginRequest } from '@Api/auth/requests/login.dto'

/**
 * Decorator used to add generic authentication headers to a route.
 * @param authType the type of authentication used for the route
 */
// I disable the TS error for the next line because the function return type is the same as applyDecorators,
// and his return is a function.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function AuthApiDecorators(authType: AuthType) {
  switch (authType) {
    case AuthType.JWT:
      return applyDecorators(
        ApiHeader({ name: 'Authorization', description: 'Bearer {token}', required: true }),
        ApiHeader({ name: 'Cookie', description: 'refresh_token={token}', required: true })
      )
    case AuthType.CREDENTIALS:
      return applyDecorators(ApiBody({ type: LoginRequest, required: true }))
  }
}
