import { User } from '@/schemas/user'
import { AdminComment } from '@Schemas/common/pojos'

describe('Schema - Comment', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const text = 'Message'
    const date = new Date()

    const admin = User.of('john', 'doe', '0612345678', 'john@doe.com', '12345')
    admin.setAdminStatus(true)

    // When
    const comment = AdminComment.of(text, admin, date)

    expect(comment.text).toBe(text)
    expect(comment.authorId).toBe(admin._id.toString())
    expect(comment.authorName).toBe(admin.getFullName())
    expect(comment.date).toBe(date)
  })
})
