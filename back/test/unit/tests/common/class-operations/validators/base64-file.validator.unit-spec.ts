import { IsBase64File } from '@Common/class-operations/validators/base64-file.validator'
import { validate } from 'class-validator'

class TestClass {
  @IsBase64File()
  test

  constructor(test) {
    this.test = test
  }
}

describe('Validator - IsBase64File', () => {
  it('should validate with valid base64 string', async () => {
    const testInstance = new TestClass('data:image/png;base64,iVBORw0KG')

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(0)
  })

  it('should validate with valid base64 array', async () => {
    const testInstance = new TestClass(['data:image/png;base64,iVBORw0', 'data:image/jpg;base64,/9j/4AAQSk'])

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(0)
  })

  it('should invalidate with invalid base64 string', async () => {
    const testInstance = new TestClass('qdqsdqefrqsf')

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(1)
  })

  it('should invalidate with invalid base64 string', async () => {
    const testInstance = new TestClass(['fqsdfqsf', 'fqsdlmfgnkdfn'])

    const errors = await validate(testInstance)

    expect(errors).toHaveLength(1)
  })
})
