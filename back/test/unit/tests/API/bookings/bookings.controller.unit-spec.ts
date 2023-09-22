import { BookingsController } from '@/API/bookings/bookings.controller'
import { BookingsService } from '@/API/bookings/bookings.service'
import { BookingToAdminResponse } from '@/API/bookings/responses/booking-to-admin.dto'
import { BoxCategories, PaymentProviderStatuses } from '@/common/enums'
import { CenterNotFoundException } from '@/common/exceptions/schemas/center'
import { Booking } from '@/schemas/booking'
import { Box, Formula } from '@/schemas/box'
import { Center } from '@/schemas/center'
import { DateTimeRange, StrictAddress } from '@/schemas/common/pojos'
import { User } from '@/schemas/user'
import { BadRequestException } from '@nestjs/common'
import { instance, mock, when } from 'ts-mockito'
import { CreateBookingUserRequest } from '@Api/bookings/requests'
import { FormulaDTO } from '@Api/centers/requests/pojos/formula.dto'
import { NewBookingResponse } from '@Api/bookings/responses'

const formulas = [Formula.of('Formule', 5, 15)]
const center = Center.of('Center with bookings', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
const centerWithNoBookings = Center.of('Center with no bookings', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
const box = Box.of({ name: 'Name', description: 'Description', center, category: BoxCategories.MECABOX, isAvailable: true, formulas })

const mockedBookings: Booking[] = [
  Booking.of(box, User.of('John-1', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined), DateTimeRange.of(new Date(), new Date()), formulas[0]),
  Booking.of(box, User.of('John-2', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined), DateTimeRange.of(new Date(), new Date()), formulas[0]),
  Booking.of(box, User.of('John-3', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined), DateTimeRange.of(new Date(), new Date()), formulas[0]),
  Booking.of(box, User.of('John-4', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined), DateTimeRange.of(new Date(), new Date()), formulas[0]),
  Booking.of(box, User.of('John-5', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined), DateTimeRange.of(new Date(), new Date()), formulas[0]),
]

describe('Controller - BookingsController', () => {
  let controller: BookingsController

  beforeAll(() => {
    const bookingsServiceMock = buildBookingsServiceMock()

    controller = new BookingsController(instance(bookingsServiceMock))
  })

  describe('When calling GET [by-center/:CENTER_ID/last-3-months]', () => {
    it.each([
      {
        name: 'should throw an error if requesting an unknown center id',
        givenValue: 'unknown-center-id',
        shouldThrow: CenterNotFoundException,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return an empty array if given a center with no bookings',
        givenValue: centerWithNoBookings._id.toString(),
        shouldThrow: null,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return the bookings with related data populated if given center with bookings',
        givenValue: center._id.toString(),
        shouldThrow: null,
        expectedBookingsAmount: mockedBookings.length,
      },
    ])('$name', async ({ givenValue, shouldThrow, expectedBookingsAmount }) => {
      // check for error
      if (shouldThrow) await expect(controller.get3LastMonthsCenterBookings(givenValue)).rejects.toThrow(shouldThrow)
      else {
        const bookingsResponse: BookingToAdminResponse[] = await controller.get3LastMonthsCenterBookings(givenValue)

        expect(bookingsResponse.length).toEqual(expectedBookingsAmount)
        for (const response of bookingsResponse) {
          expect(response.valueBox.id).toEqual(box._id.toString())
          expect(response.valueCenter.id).toEqual(center._id.toString())
        }
      }
    })
  })

  describe('When calling GET [by-center/:CENTER_ID/dates-and-categories]', () => {
    it.each([
      {
        name: 'should throw an error if send badly formatted dates',
        givenValue: {
          centerId: center._id.toString(),
          from: '0101/2000',
          to: '0101/2001',
          boxCategory: undefined,
        },
        shouldThrow: BadRequestException,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return an empty array if given a center with no bookings',
        givenValue: {
          centerId: centerWithNoBookings._id.toString(),
          from: '01-01-2000',
          to: '01-01-2001',
          boxCategory: undefined,
        },
        shouldThrow: null,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return the bookings with related data populated if given center with bookings',
        givenValue: {
          centerId: center._id.toString(),
          from: '01-01-2000',
          to: '01-01-2001',
          boxCategory: undefined,
        },
        shouldThrow: null,
        expectedBookingsAmount: mockedBookings.length,
      },
    ])('$name', async ({ givenValue, shouldThrow, expectedBookingsAmount }) => {
      const { centerId, from, to, boxCategory } = givenValue
      // check for error
      if (shouldThrow) await expect(controller.getCenterBookingsForDatesAndCategories(centerId, from, to, boxCategory)).rejects.toThrow(shouldThrow)
      else {
        const bookingsResponse: BookingToAdminResponse[] = await controller.getCenterBookingsForDatesAndCategories(centerId, from, to, boxCategory)

        expect(bookingsResponse.length).toEqual(expectedBookingsAmount)
        for (const response of bookingsResponse) {
          expect(response.valueBox.id).toEqual(box._id.toString())
          expect(response.valueCenter.id).toEqual(center._id.toString())
        }
      }
    })
  })

  describe('When calling POST []', () => {
    it('should create a booking with valid request', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request: CreateBookingUserRequest = {
        centerId: 'string',
        boxCategory: BoxCategories.MECABOX,
        startingDay: new Date(),
        beginHour: '01:00', // "HH:mm" format
        formula: Object.initClassByReflection(FormulaDTO, { label: 'string', price: 1, nbrQuarterHour: 1 }),
      }

      // When
      const booking = await controller.createBookingOnlineUser(loggedUserWrapper, request)

      // Then
      expect(booking).toBeDefined()
      expect(booking).toBeInstanceOf(NewBookingResponse)
    })

    it('should fail with invalid request', async () => {
      // Given
      const loggedUserWrapper = { user: User.of('John', 'Doe', '0612345678', 'john@doe.fr', '12345') } as RequestWithLoggedUser
      const request: CreateBookingUserRequest = {
        centerId: 'string',
        boxCategory: BoxCategories.MECABOX,
        startingDay: new Date(),
        beginHour: 'abcde',
        formula: Object.initClassByReflection(FormulaDTO, { label: 'string', price: 1, nbrQuarterHour: 1 }),
      }

      // When
      const booking = async (): Promise<NewBookingResponse> => await controller.createBookingOnlineUser(loggedUserWrapper, request)

      // Then
      await expect(booking).rejects.toThrow()
    })
  })

  describe('When calling GET [availability/center/date]', () => {
    it.each([
      {
        name: 'should throw an error if requesting an unknown center id',
        givenValue: 'unknown-center-id',
        shouldThrow: CenterNotFoundException,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return an empty array if given a center with no bookings',
        givenValue: centerWithNoBookings._id.toString(),
        shouldThrow: null,
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return the bookings with related data populated if given center with bookings',
        givenValue: center._id.toString(),
        shouldThrow: null,
        expectedBookingsAmount: mockedBookings.length,
      },
    ])('$name', async ({ givenValue, shouldThrow, expectedBookingsAmount }) => {
      // check for error
      if (shouldThrow) await expect(controller.get3LastMonthsCenterBookings(givenValue)).rejects.toThrow(shouldThrow)
      else {
        const bookingsResponse: BookingToAdminResponse[] = await controller.get3LastMonthsCenterBookings(givenValue)

        expect(bookingsResponse.length).toEqual(expectedBookingsAmount)
        for (const response of bookingsResponse) {
          expect(response.valueBox.id).toEqual(box._id.toString())
          expect(response.valueCenter.id).toEqual(center._id.toString())
        }
      }
    })
  })
})

function buildBookingsServiceMock(): BookingsService {
  const mocked = mock(BookingsService)

  when(mocked.get3LastMonthCenterBookings).thenReturn(async (centerId: string) => {
    if (centerId === 'unknown-center-id') throw new CenterNotFoundException()

    return mockedBookings.filter((booking) => booking.valueCenterId === centerId)
  })
  when(mocked.getCenterBookingsForDatesAndCategories).thenReturn(async (centerId: string) => {
    return mockedBookings.filter((booking) => booking.valueCenterId === centerId)
  })
  when(mocked.getBookingsRelatedBoxesAndCentersAndVmcWorkers).thenReturn(async (bookings: Booking[]) => {
    const map: Record<string, { box: Box; center: Center; vmcWorker?: User }> = {}
    bookings.forEach((booking) => (map[booking._id.toString()] = { box, center }))

    return map
  })
  when(mocked.createBooking).thenReturn(async (user) => {
    return {
      booking: Booking.of(box, user, DateTimeRange.of(new Date(), new Date()), formulas[0]),
      paymentStatus: PaymentProviderStatuses.WAITING_PAYMENT,
    }
  })

  return mocked
}
