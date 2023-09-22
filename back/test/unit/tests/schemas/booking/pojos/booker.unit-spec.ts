import { Booker } from '@Schemas/booking'
import { User } from '@Schemas/user'

describe('Schema - Booker', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const user = User.of('John', 'Doe', 'email', 'password', 'password')
      const billingName = 'billingName'

      // When
      const booker = Booker.of(user, billingName)

      // Then
      expect(booker.name).toBe(user.name)
      expect(booker.lastName).toBe(user.lastName)
      expect(booker.billingName).toBe(billingName)
      expect(booker.phone).toBe(user.phone)
      expect(booker.email).toBe(user.email)
      expect(booker.customerId).toBe(user.centerClientProfile.customerId)
      expect(booker.paymentId).toBeUndefined()
      expect(booker.authorizeId).toBeUndefined()
      expect(booker.refundId).toBeUndefined()
      expect(booker.invoice).toBeUndefined()
    })

    it('should instantiate with all arguments constructor and nominal values when instantiating from admin request information', () => {
      // Given
      const name = 'John'
      const lastName = 'Doe'
      const phone = '0612345678'
      const email = 'john@doe.fr'
      const billingName = 'Michel Dupont'

      // When
      const booker = Booker.ofCustomAdminRequest(name, lastName, phone, email, billingName)

      // Then
      expect(booker.name).toBe(name)
      expect(booker.lastName).toBe(lastName)
      expect(booker.billingName).toBe(billingName)
      expect(booker.phone).toBe(phone)
      expect(booker.email).toBe(email)
      expect(booker.customerId).toBeUndefined()
      expect(booker.paymentId).toBeUndefined()
      expect(booker.authorizeId).toBeUndefined()
      expect(booker.refundId).toBeUndefined()
      expect(booker.invoice).toBeUndefined()
    })
  })

  describe('When updating booker', () => {
    it('should update payment id', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')
      const paymentId = 'paymentId'

      // When
      booker.setPaymentId(paymentId)

      // Then
      expect(booker.paymentId).toBe(paymentId)
    })

    it('should update refund id', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')
      const refundId = 'refundId'

      // When
      booker.setRefundId(refundId)

      // Then
      expect(booker.refundId).toBe(refundId)
    })
  })

  describe('When checking if booker is a registered user', () => {
    it('should return true if booker is a registered user', () => {
      // Given
      const user = User.of('John', 'Doe', 'email', 'password', 'password')
      const booker = Booker.of(user)

      // When
      const isARegisteredUser = booker.isARegisteredUser()

      // Then
      expect(isARegisteredUser).toBeTruthy()
    })

    it('should return true if booker is a registered user', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')

      // When
      const isARegisteredUser = booker.isARegisteredUser()

      // Then
      expect(isARegisteredUser).toBeFalsy()
    })
  })
})

describe('Schema - RegisteredUserBooker', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values when instantiating', () => {
      // Given
      const user = User.of('John', 'Doe', 'email', 'password', 'password')
      const billingName = 'billingName'

      // When
      const booker = Booker.of(user, billingName)

      // Then
      expect(booker.name).toBe(user.name)
      expect(booker.lastName).toBe(user.lastName)
      expect(booker.billingName).toBe(billingName)
      expect(booker.phone).toBe(user.phone)
      expect(booker.email).toBe(user.email)
      expect(booker.customerId).toBe(user.centerClientProfile.customerId)
      expect(booker.paymentId).toBeUndefined()
      expect(booker.authorizeId).toBeUndefined()
      expect(booker.refundId).toBeUndefined()
      expect(booker.invoice).toBeUndefined()
    })

    it('should instantiate with all arguments constructor and nominal values when instantiating from admin request information', () => {
      // Given
      const name = 'John'
      const lastName = 'Doe'
      const phone = '0612345678'
      const email = 'john@doe.fr'
      const billingName = 'Michel Dupont'

      // When
      const booker = Booker.ofCustomAdminRequest(name, lastName, phone, email, billingName)

      // Then
      expect(booker.name).toBe(name)
      expect(booker.lastName).toBe(lastName)
      expect(booker.billingName).toBe(billingName)
      expect(booker.phone).toBe(phone)
      expect(booker.email).toBe(email)
      expect(booker.customerId).toBeUndefined()
      expect(booker.paymentId).toBeUndefined()
      expect(booker.authorizeId).toBeUndefined()
      expect(booker.refundId).toBeUndefined()
      expect(booker.invoice).toBeUndefined()
    })
  })

  describe('When updating booker', () => {
    it('should update payment id', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')
      const paymentId = 'paymentId'

      // When
      booker.setPaymentId(paymentId)

      // Then
      expect(booker.paymentId).toBe(paymentId)
    })

    it('should update refund id', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')
      const refundId = 'refundId'

      // When
      booker.setRefundId(refundId)

      // Then
      expect(booker.refundId).toBe(refundId)
    })
  })

  describe('When checking if booker is a registered user', () => {
    it('should return true if booker is a registered user', () => {
      // Given
      const user = User.of('John', 'Doe', 'email', 'password', 'password')
      const booker = Booker.of(user)

      // When
      const isARegisteredUser = booker.isARegisteredUser()

      // Then
      expect(isARegisteredUser).toBeTruthy()
    })

    it('should return true if booker is a registered user', () => {
      // Given
      const booker = Booker.ofCustomAdminRequest('John', 'Doe', '0612345678')

      // When
      const isARegisteredUser = booker.isARegisteredUser()

      // Then
      expect(isARegisteredUser).toBeFalsy()
    })
  })
})
