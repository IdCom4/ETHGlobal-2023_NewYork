import { User } from '@Schemas/user'
import { Request } from 'express'

export {}

declare global {
  type RequestWithLoggedUser<T extends User = User> = Request & { user: T }
}
