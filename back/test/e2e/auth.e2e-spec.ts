import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { getModelForClass } from '@typegoose/typegoose'
import { User } from '@Schemas/user'
import { TokenService } from '@Common/services/token.service'
import { TestInitializer } from './configurations/test-initializer'
import { ConvertPojoToInstance } from '@Common/classes/convert-pojo-to-instance.class'
import { Headers } from '@Common/enums'

describe('Auth', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await TestInitializer.initApp()
    await app.init()

    await TestInitializer.initExternalServicesMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('When registering a user', () => {
    it('should success with valid request', async function () {
      // Given
      const requestBody = {
        name: 'John',
        lastName: 'Doe',
        phone: '0612345678',
        email: 'may@gemail.com',
        password: 'moxtdepasse',
        isProfessional: false,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/register').send(requestBody)
      // Then
      expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT)
      expect(response.header['content-type']).toBeFalsy()
      expect(response.body).toEqual({})
    })

    it('should fail with invalid request', async function () {
      // Given
      const requestBody = {
        name: 'John',
        lastName: 'Doe',
        email: 'may@gemail.com',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/register').send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.error).toBe('Bad Request')
    })

    it('should fail with an already registered email', async function () {
      // Given
      const requestBody = {
        name: 'John',
        lastName: 'Doe',
        phone: '0612345678',
        email: 'john@doe.fr',
        password: 'moxtdepasse',
        isProfessional: false,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/register').send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Cette adresse email est déjà associée à un compte')
    })
  })

  describe('When registering a professional user', () => {
    it('should success with valid request', async function () {
      // Given
      const requestBody = {
        name: 'John',
        lastName: 'Doe',
        phone: '0612345678',
        email: 'may@gemail.com',
        password: 'moxtdepasse',
        isProfessional: true,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/register').send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT)
      expect(response.header['content-type']).toBeFalsy()
      expect(response.body).toEqual({})
    })

    it('should fail with invalid request', async function () {
      // Given
      const requestBody = {
        name: 'John',
        lastName: 'Doe',
        email: 'may@gemail.com',
        password: 'moxtdepasse',
        isProfessional: true,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/register').send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.error).toBe('Bad Request')
    })
  })

  describe('When logging', () => {
    it('should success with valid request', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.user).toBeTruthy()
      expect(response.body.user.birthday).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) // ISO 8601 UTC format
      expect(response.body.accessToken).toBeTruthy()
      expect(response.body.refreshToken).toBeTruthy()
    })

    it('should success and return formatted date with headers', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .post('/auth/login')
        .set(Headers.TIMEZONE, `Europe/Paris`)
        .set(Headers.LOCALE, `fr-FR`)
        .send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.user).toBeTruthy()
      expect(response.body.user.birthday).toMatch(
        /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}\s(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      ) // Requested format
      expect(response.body.accessToken).toBeTruthy()
      expect(response.body.refreshToken).toBeTruthy()
    })

    it('should fail with random locale header', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .post('/auth/login')
        .set(Headers.TIMEZONE, `Europe/Paris`)
        .set(Headers.LOCALE, `zz-ZZ`)
        .send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe("Given locale isn't supported")
    })

    it('should fail with random timezone header', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .post('/auth/login')
        .set(Headers.TIMEZONE, `Kelkepar/Otrepar`)
        .set(Headers.LOCALE, `fr-FR`)
        .send(requestBody)

      // Then
      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe("Given timezone isn't supported")
    })

    it('should fail with invalid request', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Unauthorized')
    })

    it('should fail with invalid credentials', async function () {
      // Given
      const requestBody = {
        email: 'john@doe.fr',
        password: 'CEMDPNEXISTEPAS',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Adresse email ou mot de passe invalide')
    })

    it('should fail with unconfirmed email', async function () {
      // Given
      const requestBody = {
        email: 'jone@spam.fr',
        password: 'moxtdepasse',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Vous devez confirmer votre email avant de pouvoir vous connecter')
    })

    // noinspection DuplicatedCode
    it('should fail with unregistered user', async function () {
      // Given
      const requestBody = {
        email: 'random@email.fr',
        password: 'random_password',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Adresse email ou mot de passe invalide')
    })
  })

  describe('When logout', () => {
    let tokenFactory: TokenService
    let accessToken: string
    let refreshToken: string

    beforeEach(async () => {
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      accessToken = response.body.accessToken
      refreshToken = response.body.refreshToken
      tokenFactory = app.get<TokenService>(TokenService)
    })

    it('should success a with valid request', async function () {
      // When
      const response: request.Response = await request(app.getHttpServer())
        .get('/auth/logout')
        .set(Headers.AUTHORIZATION, `Bearer ${accessToken}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send()

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Vous êtes déconnecté')
    })

    it('should fail with a random token', async function () {
      // When
      const response: request.Response = await request(app.getHttpServer())
        .get('/auth/logout')
        .set(Headers.AUTHORIZATION, `Bearer ey5qsz1df2qs6df4sd84fs6f84`)
        .set(Headers.COOKIE, [`refresh_token=eyJhbGciOiJIdddUzI1NiIsInR5cCI6IkpXVCJ9`])
        .send()

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Unauthorized')
    })

    it('should fail with a token from an unknown user', async function () {
      // When
      const response: request.Response = await request(app.getHttpServer())
        .get('/auth/logout')
        .set(
          Headers.AUTHORIZATION,
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjAxYzllNjhkMDVlMTg2YWJjYzFjNWQ1IiwiZW1haWwiOiJkZWRlZEBnbWFpbC5jb20iLCJpYXQiOjE2ODA3ODc1NTl9.0XwmrNNpV4KjqAixwhdHn5rSLvTG2YiAFncvdXHQ5fU`
        )
        .set(Headers.COOKIE, [`refresh_token=eyJhbGciOiJIdddUzI1NiIsInR5cCI6IkpXVCJ9`])
        .send()

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Veuillez vous connecter')
    })

    it('should fail with a not logged user', async function () {
      // Given
      const user = <User>(
        ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'jaune.deau@pro.fr' }).lean().exec(), { targetClass: User })
      )
      const token = await tokenFactory.createAccessToken(user)

      // When
      const response: request.Response = await request(app.getHttpServer())
        .get('/auth/logout')
        .set(Headers.AUTHORIZATION, `Bearer ${token}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send()

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Veuillez vous reconnecter')
    })
  })

  describe('When refreshing access token', () => {
    let refreshToken: string

    beforeEach(async () => {
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      refreshToken = response.body.refreshToken
    })

    it('should success with valid request', async function () {
      // Given
      const requestBody = {
        refreshToken: refreshToken,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/refresh').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.accessToken).toBeTruthy()
    })

    it('should fail with invalid request', async function () {
      // Given
      const requestBody = {
        riz_fraiche_token: refreshToken,
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/refresh').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toContain('Vous devez renseigner un refresh token.')
    })

    it('should fail with an invalid token', async function () {
      const requestBody = {
        refreshToken: 'eyJdH4gGueMjegQ5rH3FHXEt4qpfc9zwsSLuungSUF4g2rXoDtrDcsJLNABL2zQUNWZMz',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/refresh').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toContain('Le token envoyé ne réfère à aucun utilisateur')
    })

    it('should fail with an unknown user token', async function () {
      const requestBody = {
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjAxYzllNjhkMDVlMTg2YWJjYzFjNWQ1IiwiZW1haWwiOiJkZWRlZEBnbWFpbC5jb20iLCJpYXQiOjE2ODA3ODc1NTl9.0XwmrNNpV4KjqAixwhdHn5rSLvTG2YiAFncvdXHQ5fU',
      }

      // When
      const response: request.Response = await request(app.getHttpServer()).post('/auth/refresh').send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toContain('Le token envoyé ne réfère à aucun utilisateur')
    })
  })

  describe('When validating an email', () => {
    let tokenService: TokenService

    beforeAll(async () => {
      tokenService = app.get<TokenService>(TokenService)
    })

    it('should success with valid token', async function () {
      // Given
      const notValidatedUser: User = <User>(
        ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'jone@spam.fr' }).lean().exec(), { targetClass: User })
      )
      const validationToken = await tokenService.createValidationMailToken(notValidatedUser)

      // When
      const response: request.Response = await request(app.getHttpServer()).get(`/auth/validate-email/${validationToken}`)

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Email validé')
    })

    it('should fail with invalid token', async function () {
      // Given

      // When
      const response: request.Response = await request(app.getHttpServer()).get(
        `/auth/validate-email/eyJdH4gGueMjegQ5rH3FHXEt4qpfc9zwsSLuungSUF4g2rXoDtrDcsJLNABL2zQUNWZMz`
      )

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Invalid token')
    })

    it('should fail with an already validated account', async function () {
      // Given
      const notValidatedUser: User = <User>(
        ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'john@doe.fr' }).lean().exec(), { targetClass: User })
      )
      const validationToken = await tokenService.createValidationMailToken(notValidatedUser)

      // When
      const response: request.Response = await request(app.getHttpServer()).get(`/auth/validate-email/${validationToken}`)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe("L'adresse email a déjà été validée")
    })
  })

  describe('When password is forgotten', () => {
    describe('When requesting mail', () => {
      it('should return a success message with a valid address', async function () {
        // Given
        const mailAddress = 'john@doe.fr'

        // When
        const response: request.Response = await request(app.getHttpServer()).get(`/auth/password-recovery/${mailAddress}`)

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message).toBe(
          "Si l'email correspond à un utilisateur, un mail lui a été envoyé avec les détails de la récupération du mot de passe."
        )
      })

      it('should return a success message with an invalid address', async function () {
        // Given
        const mailAddress = 'adrais@mayle.kome'

        // When
        const response: request.Response = await request(app.getHttpServer()).get(`/auth/password-recovery/${mailAddress}`)

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message).toBe(
          "Si l'email correspond à un utilisateur, un mail lui a été envoyé avec les détails de la récupération du mot de passe."
        )
      })
    })

    describe('When an mail was sent', () => {
      beforeEach(async () => {
        const mailAddress = 'john@doe.fr'

        await request(app.getHttpServer()).get(`/auth/password-recovery/${mailAddress}`)
      })

      it('change password with valid token and valid request', async function () {
        // Given
        const user = <User>(
          ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'john@doe.fr' }).lean().exec(), { targetClass: User })
        )
        const token = user.passwordRecoverToken
        const requestBody = {
          newPassword: 'ceci est un mot de passe valide :)',
          confirmation: 'ceci est un mot de passe valide :)',
        }

        // When
        const response: request.Response = await request(app.getHttpServer()).patch(`/auth/password-recovery/${token}`).send(requestBody)

        // Then
        expect(response.statusCode).toBe(HttpStatus.OK)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message).toBe('Mot de passe modifié avec succès')
      })

      it('should fail with valid token and an invalid request', async function () {
        // Given
        const user = <User>(
          ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'john@doe.fr' }).lean().exec(), { targetClass: User })
        )
        const token = user.passwordRecoverToken
        const requestBody = {
          newPassword: 'ceci est un mot de passe valide :)',
          // confirmation: 'je n'existe pas !',
        }

        // When
        const response: request.Response = await request(app.getHttpServer()).patch(`/auth/password-recovery/${token}`).send(requestBody)

        // Then
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message[0]).toBe('Vous devez confirmer votre mot de passe.')
      })

      it('should fail with valid token and passwords not matching', async function () {
        // Given
        const user = <User>(
          ConvertPojoToInstance.convert(await getModelForClass(User).findOne({ email: 'john@doe.fr' }).lean().exec(), { targetClass: User })
        )
        const token = user.passwordRecoverToken
        const requestBody = {
          newPassword: 'ceci est un mot de passe valide :)',
          confirmation: 'ceci est un mot de passe différent :(',
        }

        // When
        const response: request.Response = await request(app.getHttpServer()).patch(`/auth/password-recovery/${token}`).send(requestBody)

        // Then
        expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message).toBe('Les mots de passe ne correspondent pas')
      })

      it('should fail with invalid token', async function () {
        // Given
        const requestBody = {
          newPassword: 'ceci est un mot de passe valide :)',
          confirmation: 'ceci est un mot de passe valide :(',
        }

        // When
        const response: request.Response = await request(app.getHttpServer())
          .patch('/auth/password-recovery/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2')
          .send(requestBody)

        // Then
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
        expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
        expect(response.body.message).toBe('Invalid token')
      })
    })
  })

  describe('When user changing his password', () => {
    let accessToken: string
    let refreshToken: string

    beforeEach(async () => {
      const requestBody = {
        email: 'john@doe.fr',
        password: 'moxtdepasse',
      }
      const response: request.Response = await request(app.getHttpServer()).post('/auth/login').send(requestBody)

      accessToken = response.body.accessToken
      refreshToken = response.body.refreshToken
    })

    it('should success with valid request', async () => {
      // Given
      const requestBody = {
        newPassword: 'ceci est un mot de passe valide :)',
        confirmation: 'ceci est un mot de passe valide :)',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .patch(`/auth/change-password`)
        .set(Headers.AUTHORIZATION, `Bearer ${accessToken}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Mot de passe modifié avec succès')
    })

    it('should fail with invalid request', async () => {
      // Given
      const requestBody = {
        newPassword: 'ceci est un mot de passe valide :)',
        // confirmation: 'je n'existe pas !',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .patch(`/auth/change-password`)
        .set(Headers.AUTHORIZATION, `Bearer ${accessToken}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message[0]).toBe('Vous devez confirmer votre mot de passe.')
    })

    it('should fail with passwords not matching', async () => {
      // Given
      const requestBody = {
        newPassword: 'ceci est un mot de passe valide :)',
        confirmation: 'ceci est un mot de passe différent :(',
      }

      // When
      const response: request.Response = await request(app.getHttpServer())
        .patch(`/auth/change-password`)
        .set(Headers.AUTHORIZATION, `Bearer ${accessToken}`)
        .set(Headers.COOKIE, [`refresh_token=${refreshToken}`])
        .send(requestBody)

      // Then
      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.header['content-type']).toMatch('application/json; charset=utf-8')
      expect(response.body.message).toBe('Les mots de passe ne correspondent pas')
    })
  })
})
