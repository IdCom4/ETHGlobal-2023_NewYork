import { IncomingHttpHeaders } from 'http'

export {}

declare global {
  type TQueries = { [key: string]: undefined | string | string[] | TQueries | TQueries[] }

  interface IRequest<TBody extends string | object | unknown | undefined = undefined> {
    headers: IncomingHttpHeaders
    query: TQueries
    params: Record<string, string>
    body: TBody
    bodyType?: TClassConstructor<TBody>
  }
}
