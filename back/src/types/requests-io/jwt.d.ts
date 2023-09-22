export {}

declare global {
  type TToken = string
  type TTokenPayload = { userId: string; email: string; iat: number; exp?: number }
  type TTokenPayloadProperties = keyof TTokenPayload
}
