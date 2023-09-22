import { INestApplication, ValidationPipe } from '@nestjs/common'
import { setGlobalOptions, Severity } from '@typegoose/typegoose'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import * as cookieParser from 'cookie-parser'
import * as SendGrid from '@sendgrid/mail'

export class TestInitializer {
  public static async initApp(): Promise<INestApplication> {
    setGlobalOptions({ options: { allowMixed: Severity.ALLOW } })
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    const app = moduleRef.createNestApplication()
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    return app
  }

  public static async initExternalServicesMocks() {
    // SendGrid mock
    const sendMock = jest.fn().mockResolvedValue(Promise.resolve())
    jest.spyOn(SendGrid, 'send').mockImplementation(sendMock)

    // AWS S3 Mock
    jest.mock('../../../src/common/external-service-providers-api/file-host/s3.wrapper', () => {
      // TODO : Ne fonctionne pas !
      jest.fn().mockImplementation(() => {
        return {
          async putObject(): Promise<void> {
            return
          },

          async deleteObject(): Promise<void> {
            return
          },

          async getObject(): Promise<string> {
            return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII='
          },

          async getFileNameList(): Promise<string[]> {
            return ['SkeTuVe', 'InOtrTruc']
          },
        }
      })
    })
  }
}
