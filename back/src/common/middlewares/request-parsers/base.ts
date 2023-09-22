import http from 'http'

export type TParserVerify = (req: http.IncomingMessage, res: http.ServerResponse, buf: Buffer, encoding: string) => boolean
