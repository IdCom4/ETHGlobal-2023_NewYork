import { BookingTypes, BoxCategories, DocumentTypes } from '@/common/enums/schemas'
import { BoxFormulaNotFoundException, BoxNotAvailableException, BoxNotFoundException } from '@/common/exceptions/schemas/box'
import { BookingRepository, BoxRepository, CenterRepository, UserRepository } from '@/repositories'
import { Booking, OnlineUserBooking } from '@/schemas/booking'
import { Inject, Injectable } from '@nestjs/common/decorators'
import { PromoCodesService } from '@Api/promo-code/promo-code.service'
import { Box } from '@/schemas/box'
import { User } from '@/schemas/user'
import { Formula } from '@/schemas/box/pojos'
import { PromoCode } from '@/schemas/promo-code'
import { UserAlreadyUsedPromoCodeException } from '@/common/exceptions/schemas/promo-code'
import { DateTimeRange } from '@/schemas/common/pojos'
import { PaymentProviderStatuses, PaymentStatuses, RefundProviderStatuses, TrackedEvent, VmcCompaniesKeyNames } from '@/common/enums'
import { BookingCannotBeCanceledException, BookingNotFoundException } from '@/common/exceptions/schemas/booking'
import { InternalServerErrorException } from '@nestjs/common/exceptions'
import { IMailAPI } from '@/common/external-service-providers-api'
import { CenterNotFoundException } from '@/common/exceptions/schemas/center'
import { BadRequestException } from '@nestjs/common'
import { PaymentsService } from '@Api/payments/payments.service'
import { TrackerDispatcher } from '@/common/external-service-providers-api/tracker'
import { Interval } from '@nestjs/schedule'
import '@/extensions'
import { DateTimeScopes } from '@/extensions'
import { Center } from '@/schemas/center'
import { UserNotFoundException } from '@/common/exceptions/schemas/user'

@Injectable()
export class BookingsService {
  constructor(
    @Inject('MailAPI') private readonly mailAPI: IMailAPI,
    private readonly promoCodesService: PromoCodesService,
    private readonly paymentsService: PaymentsService,
    private readonly bookingRepository: BookingRepository,
    private readonly boxRepository: BoxRepository,
    private readonly userRepository: UserRepository,
    private readonly centerRepository: CenterRepository,
    private readonly trackerDispatcher: TrackerDispatcher
  ) {}

  /* METHODS */

  /* BOOKING CREATION */

  /**
   * Create a booking from an online user request
   * @param {User} user the user who wants to book
   * @param {string} creditCardId the credit card id to use for the payment
   * @param {object} bookingData the booking data
   * @param {string} bookingData.centerId the center id where the box is located
   * @param {BoxCategories} bookingData.boxCategory the box category that the booker chose
   * @param {Date} bookingData.startingDay the starting day of the booking
   * @param {string} bookingData.beginHour the starting hour of the booking
   * @param {Formula} bookingData.wantedFormula the formula that the booker chose
   * @param {string} [bookingData.promoCodeLabel] the promo code label that the booker chose
   * @returns {Promise<{ booking: Booking; paymentStatus: PaymentProviderStatuses; clientSecret?: string }>} the created booking and the payment status
   */
  public async createBooking(
    user: User,
    creditCardId: string,
    bookingData: {
      centerId: string
      boxCategory: BoxCategories
      startingDay: Date
      beginHour: string
      wantedFormula: Formula
      promoCodeLabel?: string
    }
  ): Promise<{ booking: Booking; paymentStatus: PaymentProviderStatuses; clientSecret?: string }> {
    // fetch requested valueBoxes
    const activeBoxes = await this.boxRepository.findAllActivesByCenterIdAndCategory(bookingData.centerId, bookingData.boxCategory).getOrThrow()
    if (!activeBoxes.length) throw new BoxNotAvailableException()

    // fetch requested formula
    const selectedFormula = activeBoxes[0].formulas.find((formula) => formula.label === bookingData.wantedFormula.label)
    if (!selectedFormula) throw new BoxFormulaNotFoundException()

    const [hour, minute] = bookingData.beginHour.split(':').map((timeData) => parseInt(timeData))
    if (minute % 15 !== 0)
      throw new BadRequestException("L'heure de début doit représenter une tranche de 15 minutes. (ex: 08:00 | 08:15 | 08:30 | 08:45)")

    // check if date is not before now
    const requestedBeginMoment = new Date(bookingData.startingDay)
    requestedBeginMoment.setUTCHours(hour)
    requestedBeginMoment.setUTCMinutes(minute)

    if (requestedBeginMoment.isBeforeOrEqual(new Date())) throw new BadRequestException("Ce créneau n'est plus disponible")

    const formulaDuration = selectedFormula.getDurationAsHoursAndMinutes()

    const from = bookingData.startingDay
    from.setUTCHours(hour, minute)

    const to = new Date(bookingData.startingDay).toUTC()
    to.setUTCHours(hour + formulaDuration.hours, minute + formulaDuration.minutes)

    // fetch first available box
    const chosenCenter = await this.centerRepository.findById(bookingData.centerId).getOrThrow(new CenterNotFoundException())
    const selectedBox = activeBoxes.find((box) => box.checkAvailability(from, to))
    if (!selectedBox) throw new BoxNotAvailableException()

    // fetch promo code if there is
    const promoCode: PromoCode | undefined = bookingData.promoCodeLabel
      ? await this.promoCodesService.getPromoCodeByLabel(bookingData.promoCodeLabel)
      : undefined

    // if there is, check that it hasn't already been used by the user
    if (promoCode && promoCode.isAlreadyUsedByUser(user._id.toString())) throw new UserAlreadyUsedPromoCodeException()

    const booking = Booking.of(selectedBox, user, DateTimeRange.of(from, to), selectedFormula, promoCode)

    // then save the new booking
    const savedBooking: Booking = await this.bookingRepository.create(booking)

    let paymentResponse: IPaymentResponse
    const documentData = { documentType: DocumentTypes.BOOKING, documentId: savedBooking._id.toString() }

    if (creditCardId !== '')
      // try to debit the card
      paymentResponse = await this.paymentsService.debitCreditCard(
        user,
        VmcCompaniesKeyNames.CENTER,
        creditCardId,
        booking.quote.totalTTC,
        documentData
      )
    else {
      paymentResponse = await this.paymentsService.createPaymentIntent(user, VmcCompaniesKeyNames.CENTER, booking.quote.totalTTC, documentData)
    }

    // set booking's payment information accordingly to the result
    savedBooking.booker.setPaymentId(paymentResponse.paymentId)
    savedBooking.setPaymentStatus(paymentResponse.status === PaymentProviderStatuses.SUCCESS ? PaymentStatuses.PAID : PaymentStatuses.NOT_PAID)
    await this.bookingRepository.updateAsIs(savedBooking)

    // track event
    await this.trackerDispatcher.sendEvents(TrackedEvent.BOX_RESERVATION, user)

    // send mails
    await this.mailAPI.sendBookingCreatedEmail(
      { id: savedBooking._id.toString(), createdAt: savedBooking.getCreatedAt(), begin: savedBooking.from },
      { id: user._id.toString(), email: user.email, name: user.name, lastName: user.lastName },
      chosenCenter.name
    )

    return {
      booking: savedBooking,
      paymentStatus: paymentResponse.status,
      clientSecret: paymentResponse.paymentIdClientSecret,
    }
  }

  /**
   *  Creates a booking from an admin request
   *
   *  @param {String} boxId The box id that the admin chose
   *
   *  @param {BookingTypes} bookingType The booking type, to specify if it's being made from a phone call or the value center
   *
   *  @param {String} bookerName The first name of the booker
   *  @param {String} bookerLastName The last name of the booker
   *  @param {String} [bookerBillingName] The name to write on the bill, booker's name will be used if null (Optional)
   *  @param {Number} priceTTC The price of the booking
   *  @param {PaymentStatuses} paymentStatus The payment status of the booking
   *  @param {Boolean} vmcService whether the booker is a VMC service or not
   *  @param {String} [bookerEmail] The email address of the booker (Optional)
   *  @param {String} bookerPhone The phone number of the booker
   *
   *  @param {Date} from The beginning of the booking duration
   *  @param {Date} to The end of the booking duration
   *
   *  @param {String} [bookingGoal] The task the booker intend to do in the box (Optional)
   *  @param {Boolean} needAdvices whether the booker needs advices to complete the task or not
   *
   *
   *  @param {String} [vmcWorkerId] The id of the vmc worker that will be assigned to the booking (Optional)
   *  @param {String} [teamComment] The comment that the team will add to the booking (Optional)
   *  @return the newly created booking
   */
  public async createAdminBooking(
    boxId: string,
    bookingType: BookingTypes,
    bookerName: string,
    bookerLastName: string,
    bookerPhone: string,
    from: Date,
    to: Date,
    needAdvices: boolean,
    priceTTC: number,
    paymentStatus: PaymentStatuses,
    vmcService: boolean,
    bookerEmail?: string,
    bookerBillingName?: string,
    vmcWorkerId?: string,
    bookingGoal?: string,
    teamComment?: string
  ): Promise<Booking> {
    // fetch requested box
    const selectedBox = await this.boxRepository.findById(boxId).getOrThrow(new BoxNotFoundException())

    // check if box is bookable
    if (!selectedBox.isBookable()) throw new BoxNotAvailableException()

    // check if it's available
    if (!selectedBox.checkAvailability(from, to)) throw new BoxNotAvailableException()

    const booking = Booking.ofCustomAdminRequest(
      selectedBox,
      bookingType,
      DateTimeRange.of(from, to),
      paymentStatus,
      priceTTC,
      vmcService,
      needAdvices,
      bookerName,
      bookerLastName,
      bookerPhone,
      bookerEmail,
      bookerBillingName,
      bookingGoal,
      vmcWorkerId,
      teamComment
    )

    // save the booking to create its id
    const savedBooking = await this.bookingRepository.create(booking)

    // add it to the box's bookings ref
    selectedBox.addBookingReference(savedBooking)
    await this.boxRepository.updateAsIs(selectedBox)

    // return it
    return savedBooking
  }

  /* GETTERS & SETTERS */

  /**
   *  Get booking by id
   *
   *  @param bookingId The booking's id
   *  @returns the requested booking
   */
  public async getBookingById(bookingId: string): Promise<Booking> {
    return this.bookingRepository.findById(bookingId).getOrThrow(new BookingNotFoundException())
  }

  /**
   *  Get all bookings made by a user
   *
   *  @param bookerId The booker's id
   *  @returns the requested bookings
   */
  public async getBookingsFromUser(bookerId: string): Promise<Booking[]> {
    return (await this.bookingRepository.findByBookerId(bookerId).getOr([])).sort((b1, b2) => b1.getCreatedAt().isNotEqualTo(b2.getCreatedAt()))
  }

  /**
   *  Get all bookings ever made
   *
   *  @returns the requested bookings
   */
  public async getAllBookings(): Promise<Booking[]> {
    return (await this.bookingRepository.findAll().getOr([])).sort((b1, b2) => b1.getCreatedAt().isNotEqualTo(b2.getCreatedAt()))
  }

  /**
   *  Get all bookings ever made in a specific center
   *
   * @param centerId The id of the targeted center
   * @returns the requested bookings
   */
  public async getAllCenterBookings(centerId: string): Promise<Booking[]> {
    return (await this.bookingRepository.findMany({ _valueCenterId: centerId }).getOr([])).sort((b1, b2) =>
      b1.getCreatedAt().isNotEqualTo(b2.getCreatedAt())
    )
  }

  /**
   *  Get all bookings made within the past 3 months in a specific center
   *
   * @param centerId The id of the targeted center
   * @returns the requested bookings
   */
  public async get3LastMonthCenterBookings(centerId: string): Promise<Booking[]> {
    const threeMonthsBack = new Date()
    threeMonthsBack.setMonth(new Date().getMonth() - 3)

    return (await this.bookingRepository.findMany({ _valueCenterId: centerId, createdAt: { $gte: threeMonthsBack } }).getOr([])).sort((b1, b2) =>
      b1.getCreatedAt().isNotEqualTo(b2.getCreatedAt())
    )
  }

  /**
   * Fetches all provided bookings related documents
   * (Box / Center / VmcWorker)
   *
   * @param bookings the bookings
   * @returns a map of fetched data with box ids as keys
   */
  public async getBookingsRelatedBoxesAndCentersAndVmcWorkers(
    bookings: Booking[]
  ): Promise<Record<string, { box: Box; center: Center; vmcWorker?: User }>> {
    const map: Record<string, { box: Box; center: Center; vmcWorker?: User }> = {}

    // get ids
    const centerIds = bookings.map((booking) => booking.valueCenterId).removeDuplicates()
    const boxIds = bookings.map((booking) => booking.valueBoxId).removeDuplicates()
    const vmcWorkerIds = bookings
      .filter((booking) => booking.vmcService)
      .map((booking) => booking.vmcWorkerId)
      .removeDuplicates() as string[]

    // fetch documents
    const centers = await this.centerRepository.findMany({ _id: { $in: centerIds } }).getOr([])
    const boxes = await this.boxRepository.findMany({ _id: { $in: boxIds } }).getOr([])
    const vmcWorkers = await this.userRepository.findMany({ _id: { $in: vmcWorkerIds } }).getOr([])

    // populate map
    for (const booking of bookings) {
      const center = centers.find((center) => center._id.toString() === booking.valueCenterId)
      const box = boxes.find((box) => box._id.toString() === booking.valueBoxId)
      const vmcWorker = booking.vmcService ? vmcWorkers.find((worker) => worker._id.toString() === booking.vmcWorkerId) : undefined

      if (!center) throw new CenterNotFoundException('Le centre de la réservation est introuvable')
      if (!box) throw new BoxNotFoundException('Le boxe de la réservation est introuvable')

      if (booking.vmcService && !vmcWorker) throw new UserNotFoundException("L'agent VMC de la réservation est introuvable")

      map[booking._id.toString()] = { box, center, vmcWorker }
    }

    return map
  }

  /**
   * Get all bookings made within a specific date range in a specific center and for a specific box category.
   * @param centerId The id of the targeted center
   * @param from The start date
   * @param to The end date
   * @param boxCategory The box category
   * @returns The requested bookings
   */
  public async getCenterBookingsForDatesAndCategories(centerId: string, from: Date, to: Date, boxCategory?: BoxCategories): Promise<Booking[]> {
    const bookings = await this.bookingRepository
      .findMany({
        _valueCenterId: centerId,
        '_dateTimeRange._begin': { $gte: from },
        '_dateTimeRange._end': { $lt: to },
      })
      .getOr([])

    // if no box category is required, return all bookings
    if (!boxCategory) return bookings

    // else filter by category
    const boxIds = bookings.map((booking) => booking.valueBoxId)
    const boxes = await this.boxRepository.findMany({ _id: { $in: boxIds } }).getOrThrow(new BoxNotFoundException())

    return bookings.filter((booking) => boxes.find((box) => box._id.toString() === booking.valueBoxId)?.category === boxCategory)
  }

  /**
   *  Get the booking from a specific box at a specific time
   *
   *  @param boxId The box id whose booking we want
   *  @param slot The moment where the booking must be
   *  @returns The requested booking
   */
  public async getBookingByBoxIdAndSlot(boxId: string, slot: Date): Promise<Booking> {
    const boxBookings = await this.bookingRepository.findAllByBoxId(boxId).getOrThrow(new BookingNotFoundException())

    const wantedBooking = boxBookings.find((booking) => booking.dateTimeRange.contains(slot))
    if (!wantedBooking) throw new BookingNotFoundException()

    return wantedBooking
  }

  /**
   *  Get a user booking by id.
   *  This method is meant to ensure that the booking a user is trying to access belongs to him
   *
   *  @param userId The id of the user trying to get the booking
   *  @param bookingId The id of the booking to which he tries to access
   *  @returns The requested booking
   */
  public async getUserBookingById(userId: string, bookingId: string): Promise<OnlineUserBooking> {
    return this.bookingRepository.findByBookingIdAndBookerId(bookingId, userId).getOrThrow(new BookingNotFoundException())
  }

  /**
   *  Get a booking by its payment intent id.
   */
  public async getBookingByPaymentIntentId(paymentIntentId: string): Promise<Booking | null> {
    return this.bookingRepository.findBy({ '_booker._paymentIntentId': paymentIntentId }).getOrNull()
  }

  /* >==== BOXES AVAILABILITY ====> */
  /**
   *  Get box category availability map for a specific month, given a specific formula.
   *
   *  @param centerId The id of the center to which belong the boxes
   *  @param boxCategory The box category for which to get availability
   *  @param formulaLabel The label of the wanted formula
   *  @param dayOfMonth A date within the month for which to get availability
   *
   *  @return a MutableMap<string, MutableMap<string, MutableMap<string, boolean>>>
   *      where level 1 keys are the date of the availability map (in 'dd-MM-yyyy' format),
   *      level 2 key are specific individual box ids,
   *      level 3 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <'12-08-2022', <ID, <'08:45', true>>>)
   */
  public async getCenterBoxCategoryMonthAvailabilityBasedOnFormula(
    centerId: string,
    boxCategory: BoxCategories,
    formulaLabel: string,
    dayOfMonth: Date
  ): Promise<TBoxCategoryMonthAvailabilityMap> {
    // get boxes
    const activeBoxes = await this.boxRepository.findAllActivesByCenterIdAndCategory(centerId, boxCategory).getOrThrow()
    if (!activeBoxes.length) throw new BoxNotAvailableException()

    // get their current availability map
    const boxesAvailabilityMap = await this.getCategoryAvailabilityByMonth(centerId, boxCategory, dayOfMonth, true)

    // get formula
    const selectedFormula = activeBoxes[0].formulas.find((formula) => formula.label === formulaLabel)
    if (!selectedFormula) throw new BoxFormulaNotFoundException()

    // get the duration of the formula
    const formulaDurationInQuarterHour = selectedFormula.nbrQuarterHour

    // for each date of the month
    for (const date in boxesAvailabilityMap) {
      // for each box of this category in this center
      for (const boxId in boxesAvailabilityMap[date]) {
        const slots = Object.keys(boxesAvailabilityMap[date][boxId])

        // for each time slot this day in this box
        for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
          let available = boxesAvailabilityMap[date][boxId][slots[slotIndex]]

          // check if all following slots are available to fit the formula
          const notEnoughSlotsLeft = slotIndex + formulaDurationInQuarterHour > slots.length
          if (notEnoughSlotsLeft) available = false
          else {
            for (let slotIndexBis = slotIndex; slotIndexBis < formulaDurationInQuarterHour && slotIndexBis < slots.length; slotIndexBis++) {
              if (!boxesAvailabilityMap[date][boxId][slots[slotIndexBis]]) {
                available = false
                break
              }
            }
          }

          boxesAvailabilityMap[date][boxId][slots[slotIndex]] = available
        }
      }
    }

    return boxesAvailabilityMap
  }

  /**
   *  Get box availability map for a specific date.
   *
   *  @param {String} boxId The id of the box for which to get the availability map
   *  @param {Date} date The requested date, in 'dd-MM-yyyy' format
   *  @param {Boolean} excludePast Define
   *  if past-time slots has to be defined as false because they are not bookable anymore
   *
   *  @return a Map<string, boolean>
   *      where keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <'08:45', true>)
   */
  public async getBoxAvailabilityByDate(boxId: string, date: Date, excludePast: boolean): Promise<TBoxDateAvailabilityMap> {
    const box = await this.boxRepository.findById(boxId).getOrThrow(new BoxNotFoundException())

    // check if the box can be booked, and if not return a map with all slots set to unavailable
    if (box.isSoftDeleted()) throw new BoxNotAvailableException()

    // init date availability map
    const dateAvailabilityMap: TBoxDateAvailabilityMap = this.generateFreshBoxDateAvailabilityMap(date, box, true)

    // fetch all the active bookings of the specific box at the specified date
    const boxBookings = await this.bookingRepository
      .findAllByBoxId(box._id.toString())
      .getOrThrow(new InternalServerErrorException('Une erreur inconnue est survenue lors de la récupération des réservations en cours'))

    const activeBookingsForThatDay = boxBookings.filter(
      (booking) => !booking.isCanceled() && booking.dateTimeRange.begin.isEqualTo(date, { precision: DateTimeScopes.DAYS })
    )

    // for each booking, generate a string list of all the slots it takes
    // create a mutable set that will be filled by unavailable slots
    let unavailableSlots: string[] = []

    activeBookingsForThatDay.forEach((booking) => {
      const bookingTakenSlots: string[] = booking.generate15MinutesSlots()

      unavailableSlots = [...unavailableSlots, ...bookingTakenSlots]
    })

    // update the box availability map based of the taken slots
    const currentSlots = Object.keys(dateAvailabilityMap)
    for (const unavailableSlot of unavailableSlots) {
      if (currentSlots.includes(unavailableSlot)) dateAvailabilityMap[unavailableSlot] = false
    }

    // check if we are processing today's date and exclude past is true
    // if so, set all availability slots that are earlier than the current hour to false
    if (excludePast) {
      if (date.isBefore(new Date(), { precision: DateTimeScopes.DAYS })) {
        for (const slot of currentSlots) dateAvailabilityMap[slot] = false
      } else if (date.isEqualTo(new Date(), { precision: DateTimeScopes.DAYS })) {
        const exactlyNow = new Date()
        const todayMorningAtMidnight = new Date()
        todayMorningAtMidnight.setUTCHours(0, 0, 0, 0)

        const invalidTimeRange = DateTimeRange.of(todayMorningAtMidnight, exactlyNow)

        const invalidSlots = invalidTimeRange.generate15MinutesSlots()
        const currentSlots = Object.keys(dateAvailabilityMap)
        for (const invalidSlot of invalidSlots) {
          if (currentSlots.includes(invalidSlot)) dateAvailabilityMap[invalidSlot] = false
        }
      }
    }

    return dateAvailabilityMap
  }

  // by center
  /**
   *  Get center's box availability map for a specific date.
   *
   *  @param centerId The id of the center to which belong the boxes
   *  @param date The date for which to get availability
   *  @param {Boolean} excludePast Define
   *  if past-time slots has to be defined as false because they are not bookable anymore
   *
   *  @return a MutableMap<string, MutableMap<string, boolean>>
   *      level 1 key are specific individual box ids,
   *      level 2 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <ID, <'08:45', true>>)
   */
  public async getCenterAvailabilityByDate(centerId: string, date: Date, excludePast: boolean): Promise<TBoxesDateAvailabilityMap> {
    // init center date availability map
    const centerDateAvailabilityMap: TBoxesDateAvailabilityMap = {}

    // fetch all center's boxes that can be booked
    const bookableCenterBoxes = (await this.boxRepository.findAllActivesByCenterId(centerId).getOr([])).filter((box) => box.isBookable())

    // generate availability map for each
    for (const box of bookableCenterBoxes) {
      const boxId = box._id.toString()
      centerDateAvailabilityMap[boxId] = await this.getBoxAvailabilityByDate(boxId, date, excludePast)
    }

    return centerDateAvailabilityMap
  }

  // by category
  /**
   *  Get box category availability map for a specific month.
   *
   *  @param centerId The id of the center to which belong the boxes
   *  @param boxCategory The box category for which to get availability
   *  @param date A date within the month for which to get availability, in 'dd-MM-yyyy' format
   *  @param {Boolean} excludePast Define
   *  if past-time slots has to be defined as false because they are not bookable anymore
   *
   *  @return a MutableMap<string, MutableMap<string, MutableMap<string, boolean>>>
   *      where level 1 keys are the date of the availability map (in 'dd-MM-yyyy' format),
   *      level 2 key are specific individual box ids,
   *      level 3 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <'12-08-2022', <ID, <'08:45', true>>>)
   */
  public async getCategoryAvailabilityByMonth(
    centerId: string,
    boxCategory: BoxCategories,
    date: Date,
    excludePast: boolean
  ): Promise<TBoxCategoryMonthAvailabilityMap> {
    // init month availability map
    const categoryMonthAvailabilityMap: TBoxCategoryMonthAvailabilityMap = {}

    // get length of the month to which belong the date
    const dateMonth = date.getMonth() + 1
    const dateYear = date.getUTCFullYear()
    const offsetMonth = dateMonth + 1
    const lastDayOfMonth = Date.asUTC(`00/${offsetMonth < 10 ? `0${offsetMonth}` : offsetMonth}/${dateYear}`, 'dd/MM/yyyy')
    if (!lastDayOfMonth) throw new BadRequestException('Date invalide')

    const monthNumberOfDays: number = lastDayOfMonth.getUTCDate()

    // iterate through all days of the month
    for (let currentDay = 1; currentDay <= monthNumberOfDays; currentDay++) {
      // cast the full date of the day to string for later use as parameter
      const formatedStringCurrentDay = `${currentDay < 10 ? '0' : ''}${currentDay}`
      const formatedStringMonth = `${dateMonth < 10 ? '0' : ''}${dateMonth}`
      const formatedStringDate = `${formatedStringCurrentDay}-${formatedStringMonth}-${dateYear}`

      const date = Date.asUTC(`${formatedStringCurrentDay}/${formatedStringMonth}/${dateYear}`, 'dd/MM/yyyy')
      if (!date) throw new InternalServerErrorException('Une erreur inconnue est survenue lors du calcul des disponibilités')

      // get the category availability maps for that specific date
      const categoryDateAvailabilityMap = await this.getCategoryAvailabilityByDate(centerId, boxCategory, date, excludePast)

      // storing the date availability map in the month availability map,
      // with the date string as the key
      categoryMonthAvailabilityMap[formatedStringDate] = categoryDateAvailabilityMap
    }

    return categoryMonthAvailabilityMap
  }

  /**
   *  Get box category availability map for a specific date.
   *
   *  @param centerId The id of the center to which belong the boxes
   *  @param boxCategory The box category for which to get availability
   *  @param date The date for which to get availability, in 'dd-MM-yyyy' format
   *  @param {Boolean} excludePast Define
   *  if past-time slots has to be defined as false because they are not bookable anymore
   *
   *  @return a MutableMap<string, MutableMap<string, boolean>
   *      level 1 key are specific individual box ids,
   *      level 2 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <ID, <'08:45', true>>)
   */
  public async getCategoryAvailabilityByDate(
    centerId: string,
    boxCategory: BoxCategories,
    date: Date,
    excludePast: boolean
  ): Promise<TBoxesDateAvailabilityMap> {
    // init box category date availability maps
    const boxCategoryDateAvailabilityMaps: TBoxesDateAvailabilityMap = {}

    // get all boxes from the requested center and boxCategory
    const bookableCenterBoxes = (await this.boxRepository.findAllActivesByCenterIdAndCategory(centerId, boxCategory).getOr([])).filter((box) =>
      box.isBookable()
    )

    // for each box put a new entry to the maps,
    // with its id as key, and its availability map as value
    for (const box of bookableCenterBoxes) {
      const boxId = box._id.toString()
      boxCategoryDateAvailabilityMaps[boxId] = await this.getBoxAvailabilityByDate(boxId, date, excludePast)
    }

    return boxCategoryDateAvailabilityMaps
  }

  // by box
  /**
   *  Get box availability map for a specific week.
   *
   *  @param firstDayOfWeek The first day of the week for which we want the availability, in 'dd-MM-yyyy' format
   *  @param boxId The id of the box for which to get the availability map
   *  @param {Boolean} excludePast Define
   *  if past-time slots has to be defined as false because they are not bookable anymore
   *
   *  @return a MutableMap<string, MutableMap<string, boolean>>
   *      where level 1 keys are the date of the availability map (in 'dd-MM-yyyy' format),
   *      level 2 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <'12-08-2022', <'08:45', true>>)
   */
  public async getBoxAvailabilityByWeek(boxId: string, firstDayOfWeek: Date, excludePast: boolean): Promise<TBoxWeekAvailabilityMap> {
    // init week availability map
    const boxWeekAvailabilityMap: TBoxWeekAvailabilityMap = {}

    const dayOfWeek = firstDayOfWeek
    const oneDayInMs = 24 * 60 * 60 * 1000

    // loop 7 times, 1 for each day of the week
    for (let i = 0; i < 7; i++) {
      // parse date data to use it as method parameter
      const dayOfMonth = dayOfWeek.getDate()
      const month = dayOfWeek.getMonth() + 1

      const formatedDay = `${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}`
      const formatedMonth = `${month < 10 ? '0' : ''}${month}`
      const formatedStringDate = `${formatedDay}-${formatedMonth}-${dayOfWeek.getFullYear()}`

      const date = Date.asUTC(`${formatedDay}/${formatedMonth}/${dayOfWeek.getUTCFullYear()}`, 'dd/MM/yyyy')
      if (!date) throw new InternalServerErrorException('Une erreur inconnue est survenue lors du calcul des disponibilités')

      // generate and store the box availability for that specific date
      boxWeekAvailabilityMap[formatedStringDate] = await this.getBoxAvailabilityByDate(boxId, date, excludePast)

      // and increase the date by 1 day
      dayOfWeek.setTime(dayOfWeek.getTime() + oneDayInMs)
    }

    return boxWeekAvailabilityMap
  }

  /* OTHER METHODS */
  /**
   *  Cancel a booking by its booker.
   *
   *  @param userId The id of the booker
   *  @param bookingId The id of the booking to cancel
   */
  public async cancelUserBooking(userId: string, bookingId: string): Promise<void> {
    const booking = await this.getUserBookingById(userId, bookingId)
    const center = await this.centerRepository.findById(booking.valueCenterId).getOrThrow(new CenterNotFoundException())

    await this.cancelBooking(userId, booking, false)

    await this.mailAPI.sendBookingCanceled(booking.booker.name, booking.booker.email, center.name)
  }

  /**
   *  Cancel a booking by an admin.
   *
   *  @param userId The id of the admin who cancels the booking
   *  @param bookingId The id of the booking to cancel
   */
  public async cancelBookingAsAdmin(userId: string, bookingId: string): Promise<void> {
    const booking = await this.getBookingById(bookingId)
    const center = await this.centerRepository.findById(booking.valueCenterId).getOrThrow(new CenterNotFoundException())

    await this.cancelBooking(userId, booking, true)

    const booker = booking.booker
    if (booker.email) await this.mailAPI.sendBookingCanceled(booker.name, booker.email, center.name)
  }

  /**
   *  Validate a booking as an admin.
   *
   *  @param bookingId The id of the booking to validate
   */
  public async validateBookingAsAdmin(bookingId: string): Promise<void> {
    // fetch the booking
    const booking = await this.getBookingById(bookingId)
    const center = await this.centerRepository.findById(booking.valueCenterId).getOrThrow(new CenterNotFoundException())

    // and if it's not already validated
    if (!booking.isValidated()) {
      // do so
      booking.validateAsAdmin()
      await this.bookingRepository.updateAsIs(booking)

      // and send a validation email to the booker and the admin
      if (booking.booker.email)
        await this.mailAPI.sendBookingValidated(booking._id.toString(), booking.booker.name, booking.booker.email, center.name)
    }
  }

  /**
   *  Transfer a booking from a box to another, if the other is available at this time
   *
   *  @param bookingId The id of the booking to transfer
   *  @param newBoxId The id of the box to transfer the booking to
   */
  public async transferBookingToAnotherBoxById(bookingId: string, newBoxId: string): Promise<void> {
    // get the booking to transfer
    const booking = await this.getBookingById(bookingId)

    // get the 2 concerned boxes
    const currentBox = await this.boxRepository.findById(booking.valueBoxId).getOrThrow(new BoxNotFoundException())
    const newBox = await this.boxRepository.findById(newBoxId).getOrThrow(new BoxNotFoundException())

    // check that those 2 boxes belong to the same center
    if (currentBox.centerId != newBox.centerId) throw new BadRequestException('Les 2 boxes sélectionnés ne sont pas dans le même centre')

    // check if the new box is bookable
    if (!newBox.isBookable()) throw new BoxNotAvailableException()

    // check if the new box is available at the booking time
    if (!newBox.checkAvailability(booking.dateTimeRange.begin, booking.dateTimeRange.end)) throw new BoxNotAvailableException()

    // remove the booking ref from the old box
    currentBox.removeBookingReference(bookingId)
    await this.boxRepository.updateAsIs(currentBox)

    // add it to the new box
    newBox.addBookingReference(booking)
    await this.boxRepository.updateAsIs(newBox)

    // update box id inside the booking
    booking.updateBoxId(newBox._id.toString())
    await this.bookingRepository.updateAsIs(booking)
  }

  /**
   *  Update a booking manually by the admin
   *
   *  @param bookingId The id of the booking to update
   *  @param paymentStatus The new payment status
   *  @param [goal] The new goal
   *  @param [teamComment] The new team comment
   */
  public async updateBookingByAdmin(bookingId: string, paymentStatus: PaymentStatuses, goal?: string, teamComment?: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId).getOrThrow(new BoxNotFoundException())

    booking.update({ goal, teamComment, paymentStatus })

    await this.bookingRepository.updateAsIs(booking)
  }

  /**
   *  Update a booking with a payment Event from webhook
   *
   * @param {IPaymentEvent} paymentEvent The payment event
   */
  public async updateBookingByEvent(paymentEvent: IPaymentEvent): Promise<void> {
    if (paymentEvent.eventType !== 'payment' || !paymentEvent.paymentId) return
    const booking = await this.bookingRepository.findByPaymentIntentId(paymentEvent.paymentId).getOrNull()
    if (!booking) return

    if (paymentEvent.eventType === 'payment') {
      let paymentStatus: PaymentStatuses | null
      let shouldCancelBooking = false
      switch (paymentEvent.eventStatus) {
        case 'failed':
          paymentStatus = PaymentStatuses.DENIED
          shouldCancelBooking = true
          break
        case 'canceled':
          paymentStatus = PaymentStatuses.DENIED
          shouldCancelBooking = true
          break
        case 'partially_funded':
          paymentStatus = PaymentStatuses.NOT_PAID
          break
        case 'require_action':
          paymentStatus = PaymentStatuses.NOT_PAID
          break
        case 'success':
          paymentStatus = PaymentStatuses.PAID
          break
      }

      if (!paymentStatus) return

      booking.update({ paymentStatus })

      // if booking is paid, store in the the active bookings reference of its box
      // so that it is taken into account when checking if the box is available
      if (paymentStatus === PaymentStatuses.PAID) {
        const bookingBox = await this.boxRepository.findById(booking.valueBoxId).getOrThrow(new BoxNotFoundException())

        bookingBox.addBookingReference(booking)
        this.boxRepository.updateAsIs(bookingBox)
      }
      // there always should be a booker id as this method is only called for bookings made by users
      else if (shouldCancelBooking === true && booking.booker.id) await this.cancelBooking(booking.booker.id, booking, true)
      await this.bookingRepository.updateAsIs(booking)
    }
  }

  /* PRIVATE METHODS */

  /**
   *  Cancel a booking and refund the booker if it can
   *
   *  @param cancelerId The ID of the user who's canceling the booking
   *  @param booking The booking to cancel
   *  @param byAdmin A boolean representing the admin status of the canceler
   */
  private async cancelBooking(cancelerId: string, booking: Booking, byAdmin: boolean): Promise<void> {
    // checking if the booking can be canceled
    const userIsCancelingAndIsAllowedTo = !byAdmin && booking.canBeCanceledByBooker()
    const adminIsCancelingAndBookingIsNotYetCanceled = byAdmin && booking.canceledAt == null

    if (userIsCancelingAndIsAllowedTo || adminIsCancelingAndBookingIsNotYetCanceled) {
      // refund booker if it was an online booking
      if (booking.isBookedByAUser() && booking.paymentStatus === PaymentStatuses.PAID) {
        const refundResponse = await this.paymentsService.refundPayment(booking.booker.paymentId, VmcCompaniesKeyNames.CENTER)
        if (refundResponse.status !== RefundProviderStatuses.SUCCESS)
          throw new InternalServerErrorException('Le remboursement a échoué pour une raison inconnue. Veuillez contacter un administrateur')

        booking.booker.setRefundId(refundResponse.refundId)
      }

      // cancel booking
      booking.cancel(cancelerId)
      await this.bookingRepository.updateAsIs(booking)

      // remove it from the box references
      const boxBooking = await this.boxRepository.findById(booking.valueBoxId).getOrThrow(new BoxNotFoundException())
      boxBooking.removeBookingReference(booking._id.toString())
      await this.boxRepository.updateAsIs(boxBooking)

      // remove booking from the promo code if there is one
      if (booking.isBookedByAUser() && booking.promoCodeId) await this.promoCodesService.cancelPromoCodeUse(booking)
    } else {
      throw new BookingCannotBeCanceledException()
    }
  }

  /**
   *  Generate a fresh date availability map for a specific box.
   *
   *  @param date The LocalDate at which fetch the box opening hours
   *  @param box The box for which it creates the date availability map
   *  @param defaultValue The default value to which set the map entry values
   *
   *  @return a MutableMap<string, boolean> where keys are slices of 15 minutes between opening and closing
   *
   *  (ex: '08:00', '08:15', etc ...)
   *
   *  and all values are set to a default value.
   */
  private generateFreshBoxDateAvailabilityMap(date: Date, box: Box, defaultValue: boolean): TBoxDateAvailabilityMap {
    // get the time range of opening hours for that day
    const timeRange = box.openingHours[date.toDayOfWeek()]

    // generate a string list containing all slices of 15 minutes there is between opening and closing
    // (ex: [0] = "08:00", [1] = "08:15", etc...)
    const slots: string[] = timeRange.generate15MinutesSlots()

    const availabilityMap: Record<string, boolean> = {}

    for (const slot of slots) availabilityMap[slot] = defaultValue

    // converts it to a mutable map, with the slots as keys and <defaultValue: boolean> as values
    return availabilityMap
  }

  /**
   * Clear all unpaid online bookings that were created more than 10 minutes ago.
   * This method is called every 5 minutes.
   * It is used to free up boxes that were booked but never paid.
   */
  @Interval(300000) // every 5 minutes: 5 * 60 * 1000
  public async clearUnpaidOnlineBookings(): Promise<void> {
    // if booking was created more than 10 minutes ago, expire it
    const tenMinutesInMs = 10 * 60 * 1000
    const paymentTimeoutLimit = new Date(Date.now() - tenMinutesInMs)

    // for a booking to be considered unpaid, it must meet 3 requirements:
    // 1. being an online user booking
    // 2. having a paymentStatus of NOT_PAID
    // 3. being created more than 10 minutes ago
    const unpaidOnlineBookings = await this.bookingRepository
      .findMany({
        '_booker._id': { $nin: [null, undefined] },
        _bookingType: BookingTypes.ONLINE_USER,
        _paymentStatus: PaymentStatuses.NOT_PAID,
        createdAt: { $lt: paymentTimeoutLimit },
      })
      .getOr([])

    for (const unpaidBooking of unpaidOnlineBookings) {
      unpaidBooking.setPaymentStatus(PaymentStatuses.DENIED)
      unpaidBooking.cancel()

      await this.bookingRepository.updateAsIs(unpaidBooking)
    }
  }

  /**
   *  Generate a xlsx file from bookings data
   *
   *  @return a Pair<string, ByteArray> where the string is the filename and the byteArray its content
   */
  /* public async generateXlsx(): Pair<string, ByteArray> {

      // create a new file builder and provide the file name
      const fileBuilder = XSSFFileBuilder("${LocalDate.now().month}_bookings.xlsx")

      fileBuilder.createSheet("Bookings")

      fileBuilder.setHeader(arrayListOf("BOOKED_FROM", "CREATED_AT", "FOR_THE", "BOX_CATEGORY", "DURATION", "TOTAL_HT", "CLIENT", "CLIENT_ZIPCODE"))

      // loop through all the bookings and create a row for each one
      this.bookingRepository.findAll().forEach { booking ->
          const user: User? =
              if (booking.booker.id == null) null
              else userRepository.findById(booking.booker.id!!).orElseThrow { UserNotFoundException() }

          const box: Box = this.boxRepository.findById(booking.valueBoxId).orElseThrow { BoxNotFoundException() }

          fileBuilder.addRow(XSSFBookingRow(booking, user, box))
      }

      return fileBuilder.exportToByteArray()
  } */
}

/*
a MutableMap<string, MutableMap<string, boolean>>
   *      level 1 key are specific individual box ids,
   *      level 2 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <ID, <'08:45', true>>) */

type TBoxId = string
type TQuarterHourSlot = string // 'HH:mm' format
type TDate = string // 'dd-MM-yyyy' format

export type TBoxDateAvailabilityMap = Record<TQuarterHourSlot, boolean>
export type TBoxWeekAvailabilityMap = Record<TDate, TBoxDateAvailabilityMap>
export type TBoxesDateAvailabilityMap = Record<TBoxId, TBoxDateAvailabilityMap>
export type TBoxCategoryMonthAvailabilityMap = Record<TDate, TBoxesDateAvailabilityMap>
