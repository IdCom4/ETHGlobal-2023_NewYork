import { validate } from 'class-validator'
import { IsMongooseId } from '@Common/class-operations/validators/mongoose-id.validator'

class TestClass {
  @IsMongooseId({ each: true })
  test

  constructor(test) {
    this.test = test
  }
}

describe('Validator - IsMongooseId', () => {
  it('should validate with valid string', async () => {
    const testInstance = new TestClass('507f1f77bcf86cd799439011')

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(0)
  })

  it('should validate with valid string array', async () => {
    const testInstance = new TestClass(['507f1f77bcf86cd799439011', '607f1f77bcf86cd799439012'])

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(0)
  })

  it('should invalidate with invalid string', async () => {
    const testInstance = new TestClass('xxa999axx')

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(1)
  })

  it('should invalidate with invalid string', async () => {
    const testInstance = new TestClass(['xxa999axx', 'xxa999axx9xxa999axx'])

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(1)
  })
})
