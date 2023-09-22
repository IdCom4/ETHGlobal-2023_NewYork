import { Booking } from '@Schemas/booking'
import { Center } from '@Schemas/center'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { Box, Formula } from '@Schemas/box'
import { BookingTypes, BoxCategories, PaymentStatuses } from '@Common/enums'
import { User } from '@Schemas/user'

describe('Schema - Booking', () => {
  describe('When instantiating', () => {
    it('should success from main static constructor', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const user = User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
      const dateTimeRange = DateTimeRange.of(new Date(), new Date())
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

      // When
      const booking = Booking.of(box, user, dateTimeRange, formulas[0])

      // Then
      expect(booking.bookingType).toBe(BookingTypes.ONLINE_USER)
      expect(booking.valueBoxId).toBe(box._id.toString())
      expect(booking.valueCenterId).toBe(center._id.toString())
      expect(booking.booker.name).toBe(user.name)
      expect(booking.dateTimeRange).toBe(dateTimeRange)
      expect(booking.from).toBe(dateTimeRange.begin)
      expect(booking.to).toBe(dateTimeRange.end)
      expect(booking.paymentStatus).toBe(PaymentStatuses.NOT_PAID)
      expect(booking.quote.formula).toBe(formulas[0])
      expect(booking.goal).toBeFalsy()
      expect(booking.needAdvices).toBe(false)
      expect(booking.promoCodeId).toBeFalsy()
      expect(booking.vmcService).toBe(false)
      expect(booking.vmcWorkerId).toBeUndefined()
      expect(booking.teamComment).toBeUndefined()
      expect(booking.invoiceId).toBeUndefined()
      expect(booking.validated).toBe(false)
      expect(booking.canceledAt).toBeUndefined()
      expect(booking.canceledBy).toBeUndefined()
    })

    it('should success from admin request', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]

      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const type = BookingTypes.PHONE
      const dateTimeRange = DateTimeRange.of(new Date(), new Date())
      const paymentStatus = PaymentStatuses.DENIED
      const priceTTC = 8468468476894
      const vmcService = true
      const needAdvices = true
      const name = 'John'
      const lastName = 'Doe'
      const phone = '0612345678'
      const email = 'john@doe.fr'
      const billingName = 'John Doe'
      const goal = 'Goal'
      const vmcWorkerId = '123456789'
      const teamComment = 'Ceci est un commentaire'

      // When
      const booking = Booking.ofCustomAdminRequest(
        box,
        type,
        dateTimeRange,
        paymentStatus,
        priceTTC,
        vmcService,
        needAdvices,
        name,
        lastName,
        phone,
        email,
        billingName,
        goal,
        vmcWorkerId,
        teamComment
      )

      // Then
      expect(booking.bookingType).toBe(type)
      expect(booking.valueBoxId).toBe(box._id.toString())
      expect(booking.valueCenterId).toBe(center._id.toString())
      expect(booking.booker.name).toBe(name)
      expect(booking.dateTimeRange).toBe(dateTimeRange)
      expect(booking.from).toBe(dateTimeRange.begin)
      expect(booking.to).toBe(dateTimeRange.end)
      expect(booking.paymentStatus).toBe(paymentStatus)
      expect(booking.quote.totalTTC).toBe(priceTTC)
      expect(booking.goal).toBe(goal)
      expect(booking.needAdvices).toBe(needAdvices)
      expect(booking.promoCodeId).toBeFalsy()
      expect(booking.vmcService).toBe(vmcService)
      expect(booking.vmcWorkerId).toBe(vmcWorkerId)
      expect(booking.teamComment).toBe(teamComment)
      expect(booking.invoiceId).toBeUndefined()
      expect(booking.validated).toBe(true)
      expect(booking.canceledAt).toBeUndefined()
      expect(booking.canceledBy).toBeUndefined()
    })
  })

  it('should generate 15 minutes slots', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date('July 20, 69 20:00:00 GMT+00:00'), new Date('July 20, 69 21:00:00 GMT+00:00')),
      formulas[0]
    )

    // When
    const slots = booking.generate15MinutesSlots()

    // Then
    expect(slots).toEqual(['20:00', '20:15', '20:30', '20:45'])
  })

  it('should update', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({
      name: 'Name',
      description: 'Description',
      center,
      category: BoxCategories.MECABOX,
      isAvailable: true,
      formulas,
    })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date('July 20, 69 20:00:00 GMT+00:00'), new Date('July 20, 69 21:00:00 GMT+00:00')),
      formulas[0]
    )

    // When
    booking.update({ goal: 'New goal', paymentStatus: PaymentStatuses.PAID })

    // Then
    expect(booking.goal).toBe('New goal')
    expect(booking.paymentStatus).toBe(PaymentStatuses.PAID)
  })

  it('should update box id', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({
      name: 'Name',
      description: 'Description',
      center,
      category: BoxCategories.MECABOX,
      isAvailable: true,
      formulas,
    })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date('July 20, 69 20:00:00 GMT+00:00'), new Date('July 20, 69 21:00:00 GMT+00:00')),
      formulas[0]
    )

    // When
    booking.updateBoxId('987987987')

    // Then
    expect(booking.valueBoxId).toBe('987987987')
  })

  it('should check if booked by registered user', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({
      name: 'Name',
      description: 'Description',
      center,
      category: BoxCategories.MECABOX,
      isAvailable: true,
      formulas,
    })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date('July 20, 69 20:00:00 GMT+00:00'), new Date('July 20, 69 21:00:00 GMT+00:00')),
      formulas[0]
    )

    // When
    const result = booking.isBookedByAUser()

    // Then
    expect(result).toBe(true)
  })

  it('should validate the booking', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({
      name: 'Name',
      description: 'Description',
      center,
      category: BoxCategories.MECABOX,
      isAvailable: true,
      formulas,
    })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date('July 20, 69 20:00:00 GMT+00:00'), new Date('July 20, 69 21:00:00 GMT+00:00')),
      formulas[0]
    )

    // When
    booking.validateAsAdmin()

    // Then
    expect(booking.validated).toBe(true)
  })

  describe('When checking if booking is cancelable', () => {
    it('should return true if booked for a long time', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date('July 20, 2100 20:00:00 GMT+00:00'), new Date('July 20, 2100 21:00:00 GMT+00:00')),
        formulas[0]
      )

      // When
      const result = booking.canBeCanceledByBooker()

      // Then
      expect(result).toBe(true)
    })

    it('should return false if booked the last day', () => {
      // Given
      const now = new Date()
      const beforeYesterday = new Date(now.getDate() - 2)
      const yesterday = new Date(now.getDate() - 1)
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(beforeYesterday, yesterday),
        formulas[0]
      )

      // When
      const result = booking.canBeCanceledByBooker()

      // Then
      expect(result).toBe(false)
    })
  })

  describe('When canceling a booking', () => {
    it('should cancel the booking without a user cancelling', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )

      // When
      booking.cancel()

      // Then
      expect(booking.canceledAt).toBeDefined()
      expect(booking.canceledBy).toBeUndefined()
    })

    it('should cancel the booking with a user cancelling', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )
      const cancelerId = '12345'

      // When
      booking.cancel(cancelerId)

      // Then
      expect(booking.canceledAt).toBeDefined()
      expect(booking.canceledBy).toBe(cancelerId)
    })
  })

  describe('When checking if booking is canceled', () => {
    it('should return true with a canceled booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )
      booking.cancel()

      // When
      const result = booking.isCanceled()

      // Then
      expect(result).toBe(true)
    })

    it('should return false with an ongoing booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({
        name: 'Name',
        description: 'Description',
        center,
        category: BoxCategories.MECABOX,
        isAvailable: true,
        formulas,
      })
      const booking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )

      // When
      const result = booking.isCanceled()

      // Then
      expect(result).toBe(false)
    })
  })
})
