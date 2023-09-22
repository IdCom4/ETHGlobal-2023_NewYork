import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestInitializer } from './configurations/test-initializer'
import * as request from 'supertest'
import { User } from '@Schemas/user'
import { getModelForClass } from '@typegoose/typegoose'
import { Headers } from '@Common/enums'
import { UpdateUserAccountRequest } from '@/API/users/requests/update-user-account.dto'
import { ConvertPojoToInstance } from '@Common/classes/convert-pojo-to-instance.class'
import { Sex } from '@/common/enums/schemas'
import { LenientAddressDTO } from '@Common/request-io/request-dto'

describe('Users', () => {
  let app: INestApplication
  let accessToken: string
  let refreshToken: string

  beforeAll(async () => {
    app = await TestInitializer.initApp()
    await app.init()

    await TestInitializer.initExternalServicesMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    const requestBody = {
      email: 'john@doe.fr',
      password: 'moxtdepasse',
    }
    const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
  })

  describe('When updating account informations', () => {
    it('should success with valid request', async () => {
      // Given
      const requestBody: UpdateUserAccountRequest = {
        name: 'Blow',
        lastName: 'Joe',
        phone: '0601020304',
        sex: Sex.WOMAN,
        picture:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=', // File test.txt with "test" string
        billingAddress: Object.initClassByReflection(LenientAddressDTO, {
          street: '123 Main Street',
          city: 'Anytown',
          zipCode: '90210',
        }),
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .patch('/users/update-account')
        .set(Headers.AUTHORIZATION, `Bearer ${accessToken}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send(requestBody)

      // Then
      // Check responses
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Modification(s) effectuée(s) avec succès')
      // Check behavior
      const modifiedUser = <User>(
        ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'john@doe.fr' }).lean().exec(), { targetClass: User })
      )
      expect(modifiedUser.name).toBe('Blow')
      expect(modifiedUser.lastName).toBe('Joe')
      expect(modifiedUser.phone).toBe('0601020304')
      expect(modifiedUser.billingAddress?.street).toBe('123 Main Street')
    })
  })
})
