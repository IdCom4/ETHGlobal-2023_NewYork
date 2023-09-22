import { UserRepository } from '@/repositories'
import { setGlobalOptions, Severity } from '@typegoose/typegoose'
import { execSync } from 'child_process'
import { Test, TestingModule } from '@nestjs/testing'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule } from '@nestjs/config'
import { User } from '@Schemas/user'

describe('(Int) Repository - User', () => {
  let mongooseApp: TestingModule
  let userRepository: UserRepository

  beforeAll(async () => {
    execSync('yarn test:db:copy-data')
    setGlobalOptions({ options: { allowMixed: Severity.ALLOW } })
    mongooseApp = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: [`envs/${process.env.NODE_ENV}.env`, `envs/.env`] }),
        TypegooseModule.forRoot(<string>process.env.DB_URI),
        TypegooseModule.forFeature([User]),
      ],
      providers: [UserRepository],
    }).compile()
    userRepository = mongooseApp.get<UserRepository>(UserRepository)
  })

  beforeEach(() => {
    execSync('yarn test:db:prepopulate')
  })

  it.todo('should pass')

  describe('findById method', () => {
    test('with existing user', async () => {
      // Given
      const id = '642beaab483d9a5795288890'

      // When
      const foundUser = await userRepository.findById(id).getOrNull()

      // Then
      expect(foundUser).toBeTruthy()
      expect(foundUser?.name).toBeTruthy()
    })
  })
})
