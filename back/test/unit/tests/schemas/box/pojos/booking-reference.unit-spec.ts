import { Center } from '@Schemas/center'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { BoxCategories } from '@Common/enums'
import { BookingReference, Box, Formula } from '@Schemas/box'
import { Booking } from '@Schemas/booking'
import { User } from '@Schemas/user'

describe('Schema - BookingReference', () => {
  it('should instantiate with all arguments constructor and nominal values', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const booking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date(), new Date()),
      formulas[0]
    )

    // When
    const bookingReference = BookingReference.of(booking)

    // Then
    expect(bookingReference).toBeTruthy()
    expect(bookingReference.bookingId).toBe(booking._id.toString())
    expect(bookingReference.bookerName).toBeTruthy()
    expect(bookingReference.dateTimeRange.begin).toStrictEqual(booking.dateTimeRange.begin)
    expect(bookingReference.dateTimeRange.begin).toStrictEqual(booking.dateTimeRange.end)
  })
})
