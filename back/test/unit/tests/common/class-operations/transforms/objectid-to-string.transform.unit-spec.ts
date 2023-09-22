import { plainToInstance, Transform } from 'class-transformer'
import { objectIdToString } from '@Common/class-operations/transforms'
import mongoose from 'mongoose'

class TestClass {
  @Transform(objectIdToString)
  public id: mongoose.Types.ObjectId

  constructor(id: string) {
    this.id = new mongoose.Types.ObjectId(id)
  }
}

describe('ObjectIdToString', () => {
  it('should transform ObjectId to string', () => {
    const testInstance = new TestClass('60b1f71f2242a509d8a7f5c4')

    const instance = plainToInstance(TestClass, testInstance)

    expect(instance).toBeInstanceOf(TestClass)
    expect(instance.id).toBe('60b1f71f2242a509d8a7f5c4')
  })
})
