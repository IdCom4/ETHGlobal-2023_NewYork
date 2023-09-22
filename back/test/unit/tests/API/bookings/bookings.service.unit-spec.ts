import { BookingsService } from '@/API/bookings/bookings.service'
import { PaymentsService } from '@/API/payments/payments.service'
import { PromoCodesService } from '@/API/promo-code/promo-code.service'
import { InstantiatingDataWrapper } from '@/common/classes'
import { BookingTypes, BoxCategories, PaymentStatuses } from '@/common/enums'
import { IMailAPI, SendGridMailAPI } from '@/common/external-service-providers-api'
import { TrackerDispatcher } from '@/common/external-service-providers-api/tracker'
import { BookingRepository, BoxRepository, CenterRepository, UserRepository } from '@/repositories'
import { Booking } from '@/schemas/booking'
import { Box, Formula } from '@/schemas/box'
import { Center } from '@/schemas/center'
import { DateTimeRange, StrictAddress } from '@/schemas/common/pojos'
import { User } from '@/schemas/user'
import { instance, mock, when } from 'ts-mockito'
import '@/extensions'
import { CenterNotFoundException } from '@/common/exceptions/schemas/center'
import { BoxNotFoundException } from '@/common/exceptions/schemas/box'
import { UserNotFoundException } from '@/common/exceptions/schemas/user'

/* eslint-disable prettier/prettier */
const formulas = [Formula.of('Formule', 5, 15)]

const center1 = Center.of('Center 1', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
const center2 = Center.of('Center 2', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))
const centerWithNoBookings = Center.of('Center 3', StrictAddress.of('rue', 'ville', 'code postal', [1, 1]))

const center1Box1 = Box.of({ name: 'Name', description: 'Description', center: center1, category: BoxCategories.MECABOX, isAvailable: true, formulas })
const center1Box2 = Box.of({ name: 'Name', description: 'Description', center: center1, category: BoxCategories.WASHBOX, isAvailable: true, formulas })
const center2Box1 = Box.of({ name: 'Name', description: 'Description', center: center2, category: BoxCategories.MECABOX, isAvailable: true, formulas })
const center2Box2 = Box.of({ name: 'Name', description: 'Description', center: center2, category: BoxCategories.DETAILINGBOX, isAvailable: true, formulas })

const clientUser = User.of('John-1', 'Doe', '0612345678', 'john@doe.fr', '12345', undefined)
const vmcWorkerUser = User.of('John', 'VMC', '0612345678', 'john@vmc.fr', '12345', undefined)
vmcWorkerUser.setAdminStatus(true)

const mockedBookingsWithExistingRelatedData: Booking[] = [
  setBookingTimestamp(Booking.of(center1Box1, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])),
  setBookingTimestamp(Booking.of(center1Box2, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])),
  setBookingTimestamp(Booking.of(center2Box1, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])),
  setBookingTimestamp(Booking.ofCustomAdminRequest(center2Box2, BookingTypes.PHONE, DateTimeRange.of(new Date(), new Date()), PaymentStatuses.NOT_PAID, 50, true, false, 'John', 'Doe', '0605040302', 'john@doe.com', 'John Doe', undefined, vmcWorkerUser._id.toString())),
  setBookingTimestamp(Booking.ofCustomAdminRequest(center2Box2, BookingTypes.PHONE, DateTimeRange.of(new Date(), new Date()), PaymentStatuses.NOT_PAID, 50, false, false, 'John', 'Doe', '0605040302', 'john@doe.com', 'John Doe'))
]

const mockedBookingsWithUnknownCenter: Booking[] = [
  setBookingRelatedIdToUnknown(setBookingTimestamp(Booking.of(center1Box1, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])), '_valueCenterId'),
  setBookingRelatedIdToUnknown(setBookingTimestamp(Booking.of(center2Box1, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])), '_valueCenterId'),
]

const mockedBookingsWithUnknownBox: Booking[] = [
  setBookingRelatedIdToUnknown(setBookingTimestamp(Booking.of(center1Box2, clientUser, DateTimeRange.of(new Date(), new Date()), formulas[0])), '_valueBoxId'),
  setBookingRelatedIdToUnknown(setBookingTimestamp(Booking.ofCustomAdminRequest(center2Box2, BookingTypes.PHONE, DateTimeRange.of(new Date(), new Date()), PaymentStatuses.NOT_PAID, 50, false, false, 'John', 'Doe', '0605040302', 'john@doe.com', 'John Doe')), '_valueBoxId'),
]

const mockedBookingsWithUnknownWorker: Booking[] = [
  setBookingRelatedIdToUnknown(setBookingTimestamp(Booking.ofCustomAdminRequest(center2Box2, BookingTypes.PHONE, DateTimeRange.of(new Date(), new Date()), PaymentStatuses.NOT_PAID, 50, true, false, 'John', 'Doe', '0605040302', 'john@doe.com', 'John Doe', undefined, vmcWorkerUser._id.toString())), '_vmcWorkerId'),
]

const mockedBookingsWithUnknownRelatedData: Booking[] = [
  ...mockedBookingsWithUnknownWorker,
  ...mockedBookingsWithUnknownCenter,
  ...mockedBookingsWithUnknownBox,
]

function setBookingTimestamp(booking: Booking): Booking {
  Reflect.defineProperty(booking, 'createdAt', { value: new Date(), enumerable: true, writable: true })
  Reflect.defineProperty(booking, 'updatedAt', { value: new Date(), enumerable: true, writable: true })
  return booking
}

function setBookingRelatedIdToUnknown(booking: Booking, toSetToUnknown: '_valueBoxId' | '_valueCenterId' | '_vmcWorkerId'): Booking {
  Reflect.defineProperty(booking, toSetToUnknown, { value: 'unknown-id', enumerable: true, writable: true })
  return booking
}
/* eslint-enable prettier/prettier */

describe('Services - BookingsService', () => {
  let service: BookingsService

  beforeAll(() => {
    const mailAPIMock = buildIMailAPIMock()
    const promoCodesServiceMock = buildPromoCodesServiceMock()
    const paymentsServiceMock = buildPaymentsServiceMock()
    const bookingRepositoryMock = buildBookingRepositoryMock()
    const boxRepositoryMock = buildBoxRepositoryMock()
    const userRepositoryMock = buildUserRepositoryMock()
    const centerRepositoryMock = buildCenterRepositoryMock()
    const trackerDispatcherMock = buildTrackerDispatcherMock()

    service = new BookingsService(
      mailAPIMock,
      promoCodesServiceMock,
      paymentsServiceMock,
      bookingRepositoryMock,
      boxRepositoryMock,
      userRepositoryMock,
      centerRepositoryMock,
      trackerDispatcherMock
    )
  })

  describe('When calling [get3LastMonthCenterBookings]', () => {
    it.each([
      {
        name: 'should return an empty array if given an unknown center id',
        givenValue: 'unknown-center-id',
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return an empty array if given a center with no bookings',
        givenValue: centerWithNoBookings._id.toString(),
        expectedBookingsAmount: 0,
      },
      {
        name: 'should return the bookings with related data populated if given center with bookings',
        givenValue: center1._id.toString(),
        expectedBookingsAmount:
          mockedBookingsWithExistingRelatedData.filter((b) => b.valueCenterId === center1._id.toString()).length +
          mockedBookingsWithUnknownRelatedData.filter((b) => b.valueCenterId === center1._id.toString()).length,
      },
    ])('$name', async ({ givenValue, expectedBookingsAmount }) => {
      const bookings: Booking[] = await service.get3LastMonthCenterBookings(givenValue)
      expect(bookings.length).toEqual(expectedBookingsAmount)
    })
  })

  describe('When calling [getBookingsRelatedBoxesAndCentersAndVmcWorkers]', () => {
    it.each([
      {
        name: 'should return an empty map if given no bookings',
        givenValue: [],
        shouldThrow: null,
      },
      {
        name: 'should throw if given a booking with unknown center',
        givenValue: [...mockedBookingsWithExistingRelatedData, mockedBookingsWithUnknownCenter[0]],
        shouldThrow: true,
        error: CenterNotFoundException,
      },
      {
        name: 'should throw if given a booking with unknown box',
        givenValue: [...mockedBookingsWithExistingRelatedData, mockedBookingsWithUnknownBox[0]],
        shouldThrow: true,
        error: BoxNotFoundException,
      },
      {
        name: 'should throw if given a booking with unknown worker',
        givenValue: [...mockedBookingsWithExistingRelatedData, mockedBookingsWithUnknownWorker[0]],
        shouldThrow: true,
        error: UserNotFoundException,
      },
      {
        name: 'should throw if given a booking with unknown related document',
        givenValue: [...mockedBookingsWithExistingRelatedData, ...mockedBookingsWithUnknownRelatedData],
        shouldThrow: true,
        error: undefined,
      },
      {
        name: 'should return a completed map with requested data if given bookings with known related data',
        givenValue: mockedBookingsWithExistingRelatedData,
        shouldThrow: false,
        error: undefined,
      },
    ])('$name', async ({ givenValue, shouldThrow, error }) => {
      if (shouldThrow) await expect(service.getBookingsRelatedBoxesAndCentersAndVmcWorkers(givenValue)).rejects.toThrowError(error)
      else {
        const map = await service.getBookingsRelatedBoxesAndCentersAndVmcWorkers(givenValue)

        expect(Object.keys(map).length).toEqual(givenValue.length)

        for (const booking of givenValue) {
          const data = map[booking._id.toString()]
          expect(data).toBeDefined()

          expect(data.box._id.toString()).toEqual(booking.valueBoxId)
          expect(data.center._id.toString()).toEqual(booking.valueCenterId)
          if (booking.vmcService) expect(data.vmcWorker?._id.toString()).toEqual(booking.vmcWorkerId)
        }
      }
    })
  })

  describe('When calling [getCenterBookingsForDatesAndCategories]', () => {
    it.each([
      {
        name: 'should return an empty array if provided a center id with no bookings',
        givenValue: { centerId: centerWithNoBookings._id.toString(), from: new Date(), to: new Date() },
        expectedBookings: [],
      },
      {
        name: 'should return all center bookings from the time frame if no box category is specified',
        givenValue: { centerId: center1._id.toString(), from: new Date(), to: new Date() },
        expectedBookings: [
          ...mockedBookingsWithExistingRelatedData.filter((b) => b.valueCenterId === center1._id.toString()),
          ...mockedBookingsWithUnknownRelatedData.filter((b) => b.valueCenterId === center1._id.toString()),
        ],
      },
      {
        name: 'should return only center bookings made in the specified box category if provided',
        givenValue: { centerId: center1._id.toString(), from: new Date(), to: new Date(), boxCategory: center1Box1.category },
        expectedBookings: [
          ...mockedBookingsWithExistingRelatedData.filter(
            (b) => b.valueCenterId === center1._id.toString() && b.valueBoxId === center1Box1._id.toString()
          ),
          ...mockedBookingsWithUnknownRelatedData.filter(
            (b) => b.valueCenterId === center1._id.toString() && b.valueBoxId === center1Box1._id.toString()
          ),
        ],
      },
    ])('$name', async ({ givenValue, expectedBookings }) => {
      const { centerId, from, to, boxCategory } = givenValue

      const bookings: Booking[] = await service.getCenterBookingsForDatesAndCategories(centerId, from, to, boxCategory)

      expect(bookings.length).toEqual(expectedBookings.length)

      for (const booking of expectedBookings) expect(bookings.find((b) => b._id.toString() === booking._id.toString())).toBeDefined()
    })
  })
})

function buildIMailAPIMock(): IMailAPI {
  const mocked = mock(SendGridMailAPI)
  return instance(mocked)
}

function buildPromoCodesServiceMock(): PromoCodesService {
  const mocked = mock(PromoCodesService)
  return instance(mocked)
}

function buildPaymentsServiceMock(): PaymentsService {
  const mocked = mock(PaymentsService)
  return instance(mocked)
}

function buildBookingRepositoryMock(): BookingRepository {
  const mocked = mock(BookingRepository)

  when(mocked.findMany).thenReturn(({ _valueCenterId }) => {
    return InstantiatingDataWrapper.fromData(
      new Promise((resolve) =>
        resolve([
          ...mockedBookingsWithExistingRelatedData.filter((booking) => booking.valueCenterId === _valueCenterId),
          ...mockedBookingsWithUnknownRelatedData.filter((booking) => booking.valueCenterId === _valueCenterId),
        ])
      )
    )
  })

  return instance(mocked)
}

function buildBoxRepositoryMock(): BoxRepository {
  const mocked = mock(BoxRepository)

  when(mocked.findMany).thenReturn(({ _id }) => {
    if (_id && typeof _id === 'object') {
      const filteredBoxes = [center1Box1, center1Box2, center2Box1, center2Box2].filter((box) =>
        (_id as { $in: string[] }).$in.includes(box._id.toString())
      )
      return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve(filteredBoxes)))
    } else return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve([])))
  })

  return instance(mocked)
}

function buildUserRepositoryMock(): UserRepository {
  const mocked = mock(UserRepository)

  when(mocked.findMany).thenReturn(({ _id }) => {
    if (_id && typeof _id === 'object') {
      const filteredUsers = [clientUser, vmcWorkerUser].filter((user) => (_id as { $in: string[] }).$in.includes(user._id.toString()))
      return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve(filteredUsers)))
    } else return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve([])))
  })

  return instance(mocked)
}

function buildCenterRepositoryMock(): CenterRepository {
  const mocked = mock(CenterRepository)

  when(mocked.findMany).thenReturn(({ _id }) => {
    if (_id && typeof _id === 'object') {
      const filteredCenters = [center1, center2, centerWithNoBookings].filter((center) =>
        (_id as { $in: string[] }).$in.includes(center._id.toString())
      )
      return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve(filteredCenters)))
    } else return InstantiatingDataWrapper.fromData(new Promise((resolve) => resolve([])))
  })

  return instance(mocked)
}

function buildTrackerDispatcherMock(): TrackerDispatcher {
  const mocked = mock(TrackerDispatcher)
  return instance(mocked)
}
