import { ClassSerializerInterceptor } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { setGlobalOptions, Severity } from '@typegoose/typegoose'
import * as cookieParser from 'cookie-parser'
import { DateConverterInterceptor } from '@Common/interceptors'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CustomValidationPipeWithErrorFormatting } from '@Common/class-operations/pipes'
import { NestExpressApplication } from '@nestjs/platform-express'
import { json } from 'body-parser'
import http from 'http'
import { stripeRawBodyParser } from '@Common/middlewares/request-parsers/stripe-raw-body-parser.middleware'

async function bootstrap(): Promise<void> {
  setGlobalOptions({ options: { allowMixed: Severity.ALLOW } })
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('v1')
  app.enableCors({ credentials: true, origin: true })

  app.use(cookieParser())
  app.use(
    json({
      limit: 7500000,
      verify(req: http.IncomingMessage, res: http.ServerResponse, buf: Buffer, encoding: string) {
        if (!stripeRawBodyParser(req, res, buf, encoding)) return false
        return true
      },
    })
  )

  app.useGlobalPipes(new CustomValidationPipeWithErrorFormatting({ whitelist: true, transform: true, validateCustomDecorators: true }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new DateConverterInterceptor())

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('ValueMyCar API Docs')
    .setDescription('Documentation for the ValueMyCar API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: false })

  await app.listen(3333)
}

bootstrap()
