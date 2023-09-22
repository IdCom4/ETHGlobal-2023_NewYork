import { BoxCategories, BoxTypes } from '@Common/enums'
import { DateTimeRange, StrictAddress } from '@Schemas/common/pojos'
import { IllegalArgumentException } from '@Common/exceptions'
import { Box, Formula, IBoxUpdatePayload } from '@Schemas/box'
import { Center, WeekOpeningHours } from '@Schemas/center'
import { User } from '@Schemas/user'
import { Booking } from '@Schemas/booking'

describe('Schema - Box', () => {
  describe('When instantiating', () => {
    it('should instantiate with all arguments constructor and nominal values', () => {
      // Given
      const name = 'Name'
      const description = 'Description'
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const category = BoxCategories.MECABOX
      const isAvailable = true
      const formulas = [Formula.of('Formule', 5, 15)]

      // When
      const box = Box.of({ name, description, center, category, isAvailable, formulas })

      // Then
      expect(box.name).toBe(name)
      expect(box.description).toBe(description)
      expect(box.category).toBe(category)
      expect(box.type).toBe(BoxTypes.VALUEBOX)
      expect(box.centerId).toBe(center._id.toString())
      expect(box.openingHours).toBeTruthy()
      expect(box.location.street).toBe(center.location.street)
      expect(box.controllerId).toBeFalsy()
      expect(box.isAvailable).toBeTruthy()
      expect(box.formulas).toBe(formulas)
      expect(box.shortAvailabilityPriority).toBeFalsy()
      expect(box.bookingsReference).toStrictEqual([])
      expect(box.deletedAt).toBeFalsy()
    })

    const defaults = {
      center: Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1])),
      formulas: [Formula.of('Formule', 5, 15)],
    }
    /*
        The purpose of this test is to verify the tests performed when instating the object.
      Indeed, the IDE notices that the variables are undefined and throws a compilation error,
      On the other hand, at runtime, it is possible that these values are undefined and no error will be thrown.
      That's why I choose to intentionally ignore typescript errors in order to perform these tests.
    */
    it.each([
      /* eslint-disable prettier/prettier */
      { test_name: 'undefined name', name: undefined, description: 'Description', center: defaults.center, category: BoxCategories.MECABOX, isAvailable: true, formulas: defaults.formulas },
      { test_name: 'undefined description', name: 'Name', description: undefined, center: defaults.center, category: BoxCategories.MECABOX, isAvailable: true, formulas: defaults.formulas },
      { test_name: 'undefined center', name: 'Name', description: 'Description', center: undefined, category: BoxCategories.MECABOX, isAvailable: true, formulas: defaults.formulas },
      { test_name: 'undefined category', name: 'Name', description: 'Description', center: defaults.center, category: undefined, isAvailable: true, formulas: defaults.formulas },
      { test_name: 'undefined availability', name: 'Name', description: 'Description', center: defaults.center, category: BoxCategories.MECABOX, isAvailable: undefined, formulas: defaults.formulas },
      { test_name: 'undefined formulas', name: 'Name', description: 'Description', center: defaults.center, category: BoxCategories.MECABOX, isAvailable: true, formulas: undefined },
      /* eslint-enable prettier/prettier */
    ])('should fail with $test_name', ({ name, description, center, category, isAvailable, formulas }) => {
      // When
      // @ts-ignore
      const construct = (): Box => Box.of({ name, description, center, category, isAvailable, formulas })

      expect(construct).toThrowError(IllegalArgumentException)
    })
  })

  it('should update the box', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const dataToUpdate: Partial<IBoxUpdatePayload> = {
      name: 'New name',
      description: 'New description',
    }

    // When
    box.update(dataToUpdate)

    // Then
    expect(box.name).toBe(dataToUpdate.name)
    expect(box.description).toBe(dataToUpdate.description)
  })

  it('should soft delete the box', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

    // When
    box.softDelete()

    // Then
    expect(box.deletedAt).toBeTruthy()
  })

  describe('When checking if box is soft deleted', () => {
    it('should return true with a soft deleted box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      box.softDelete()

      // When
      const isSoftDeleted = box.isSoftDeleted()

      // Then
      expect(isSoftDeleted).toBeTruthy()
    })

    it('should return false with a not soft deleted box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

      // When
      const isSoftDeleted = box.isSoftDeleted()

      // Then
      expect(isSoftDeleted).toBeFalsy()
    })
  })

  it('should update formulas', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const newFormulas = [Formula.of('Formule 2', 10, 20)]

    // When
    box.updateFormulas(newFormulas)

    // Then
    expect(box.formulas).toBe(newFormulas)
  })

  it('should add a booking reference', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const newBooking = Booking.of(
      box,
      User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
      DateTimeRange.of(new Date(), new Date()),
      formulas[0]
    )

    // When
    box.addBookingReference(newBooking)

    // Then
    expect(box.bookingsReference[0]).toBeTruthy()
    expect(box.bookingsReference[0].bookingId.toString()).toBe(newBooking._id.toString())
  })

  describe('When removing a booking reference', () => {
    it('should return true when remove a booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const newBooking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )
      box.addBookingReference(newBooking)

      // When
      const result = box.removeBookingReference(newBooking._id.toString())

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false when remove nothing', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const newBooking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )

      // When
      const result = box.removeBookingReference(newBooking._id.toString())

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When getting a booking reference', () => {
    it('should return a booking reference when it exists', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const newBooking = Booking.of(
        box,
        User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )
      box.addBookingReference(newBooking)

      // When
      const result = box.getBookingReference(newBooking._id.toString())

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with an unknown booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const searchedBooking = Booking.of(
        box,
        User.of('John', 'Does', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date(), new Date()),
        formulas[0]
      )
      // When
      const result = box.getBookingReference(searchedBooking._id.toString())

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When checking if box is bookable', () => {
    it('should return true with an bookable box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

      // When
      const result = box.isBookable()

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with a soft deleted box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      box.softDelete()

      // When
      const result = box.isBookable()

      // Then
      expect(result).toBeFalsy()
    })

    it('should return false with an unavailable box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      box.update({ isAvailable: false })

      // When
      const result = box.isBookable()

      // Then
      expect(result).toBeFalsy()
    })

    it('should return false with no available formulas', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas: Formula[] = []
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

      // When
      const result = box.isBookable()

      // Then
      expect(result).toBeFalsy()
    })
  })

  describe('When checking if box is available', () => {
    it('should return true with an available box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

      // When
      const result = box.checkAvailability(new Date('July 20, 69 20:17:00 GMT+00:00'), new Date('July 30, 69 20:17:00 GMT+00:00'))

      // Then
      expect(result).toBeTruthy()
    })

    it('should return false with a soft deleted box', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      box.softDelete()

      // When
      const result = box.checkAvailability(new Date('July 20, 69 20:17:00 GMT+00:00'), new Date('July 30, 69 20:17:00 GMT+00:00'))

      // Then
      expect(result).toBeFalsy()
    })

    it('should return false with an overlapping booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const handledBooking = Booking.of(
        box,
        User.of('John', 'Do', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date('July 18, 69 20:17:00 GMT+00:00'), new Date('July 31, 69 20:17:00 GMT+00:00')),
        formulas[0]
      )
      box.addBookingReference(handledBooking)

      // When
      const result = box.checkAvailability(new Date('July 20, 69 20:17:00 GMT+00:00'), new Date('July 30, 69 20:17:00 GMT+00:00'))

      // Then
      expect(result).toBeFalsy()
    })

    it('should return true with a not overlapping booking', () => {
      // Given
      const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
      const formulas = [Formula.of('Formule', 5, 15)]
      const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
      const handledBooking = Booking.of(
        box,
        User.of('John', 'Do', '0612345678', 'john@doe.fr', '12345', undefined),
        DateTimeRange.of(new Date('Aug 18, 69 20:17:00 GMT+00:00'), new Date('Aug 31, 69 20:17:00 GMT+00:00')),
        formulas[0]
      )
      box.addBookingReference(handledBooking)

      // When
      const result = box.checkAvailability(new Date('July 20, 69 20:17:00 GMT+00:00'), new Date('July 30, 69 20:17:00 GMT+00:00'))

      // Then
      expect(result).toBeTruthy()
    })
  })

  it('should update location with a new location', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const newLocation = StrictAddress.of('123 Main Street', 'ville', 'code postal', [2, 2])

    // When
    box.updateLocation(newLocation)

    // Then
    expect(box.location.street).toBe(newLocation.street)
  })

  it('should update opening hours with a new location', () => {
    // Given
    const center = Center.of('Nom de centre', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
    const formulas = [Formula.of('Formule', 5, 15)]
    const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })
    const newOpeningHours = WeekOpeningHours.createEmpty()

    // When
    box.updateOpeningHours(newOpeningHours)

    // Then
    expect(box.openingHours).toBe(newOpeningHours)
  })
})
