import { ParseStringDate } from '@Common/class-operations/validators'
import { validate } from 'class-validator'

class TestClass {
  @ParseStringDate()
  test

  constructor(test) {
    this.test = test
  }
}

describe('Validator - ParseStringDate', () => {
  it('should parse date with valid string', async () => {
    const testInstance = new TestClass('02/05/2020 12:00')

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(0)
  })
})
