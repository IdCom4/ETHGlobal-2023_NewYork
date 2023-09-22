import { AdminJwtAuthGuard, JwtAuthGuard } from '@/common/auth/guards/jwt'
import { BoxCategories } from '@/common/enums/schemas'
import { EnumValidationPipe } from '@/common/request-io/query-validation-pipes'
import { MessageResponse } from '@/common/request-io/responses-dto'
import { Controller, Request, Get, Post, Body, Query, Param, UseGuards, Put, HttpStatus, ParseBoolPipe, BadRequestException } from '@nestjs/common'
import {
  BookingsService,
  TBoxCategoryMonthAvailabilityMap,
  TBoxDateAvailabilityMap,
  TBoxesDateAvailabilityMap,
  TBoxWeekAvailabilityMap,
} from './bookings.service'
import { CreateBookingAdminRequest, CreateBookingUserRequest, UpdateBookingAdminRequest } from './requests'
import { NewBookingResponse } from './responses'
import { BookingToAdminResponse } from './responses/booking-to-admin.dto'
import { BookingToBookerResponse } from './responses/booking-to-booker.dto'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthApiDecorators } from '@Common/decorators/swagger.decorator'
import { AuthType } from '@Common/enums/auth-type.enum'
import '@/extensions'
import { DatesUtils } from '@/common/utils'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a booking as a User
   *
   * @param loggedUser The logged user, resolved by the guard
   * @param request The request body
   * @returns The created booking
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Réservation créée avec succès', type: NewBookingResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Aucun boxe disponible ne répond à votre requête' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formule(s) introuvable(s)' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Code promotionnel déjà utilisé' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "L'heure de début doit être au format 'HH:mm'" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "L'heure de début doit représenter une tranche de 15 minutes. (ex: 08:00 | 08:15 | 08:30 | 08:45)",
  })
  @AuthApiDecorators(AuthType.JWT)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBookingOnlineUser(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Body() request: CreateBookingUserRequest
  ): Promise<NewBookingResponse> {
    const hourRegex = /^[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}$/
    if (!hourRegex.test(request.beginHour)) throw new BadRequestException("L'heure de début doit être au format 'HH:mm'")

    // TODO: remove french time conversion later
    const utcHours = this.convertTimeFromFrenchTZToUTC(request.beginHour)

    const { booking, paymentStatus, clientSecret } = await this.bookingsService.createBooking(loggedUser, request.creditCardId || '', {
      centerId: request.centerId,
      boxCategory: request.boxCategory,
      startingDay: request.startingDay,
      beginHour: utcHours,
      wantedFormula: request.formula.toFormula(),
      promoCodeLabel: request.promoCodeLabel,
    })

    return new NewBookingResponse(booking, paymentStatus, clientSecret)
  }

  /* BOOKING AVAILABILITY */

  // by center
  /**
   * Get the availability of a center for a given date
   * @param centerId The center id
   * @param strDate The given date
   * @param excludePast Whether to exclude past days
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @Get('availability/center/date')
  async getCenterAvailabilityByDate(
    @Query('center-id') centerId: string,
    @Query('date') strDate: string,
    @Query('exclude-past', ParseBoolPipe) excludePast: boolean
  ): Promise<TBoxesDateAvailabilityMap> {
    const date = Date.asUTC(strDate, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    const availabilityMap = await this.bookingsService.getCenterAvailabilityByDate(centerId, date, excludePast)

    // convert UTC to UTC+2
    for (const boxId in availabilityMap) {
      availabilityMap[boxId] = this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap[boxId])
    }

    return availabilityMap
  }

  /**
   * Get the availability of a center according a given category, month and formula
   *
   * @param centerId The center id
   * @param boxCategory The box category
   * @param strDate The given date
   * @param formulaLabel The formula label
   * @returns The availability map of the center
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Aucun boxe disponible ne répond à votre requête' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formule(s) introuvable(s)' })
  @ApiParam({ name: 'box-category', enum: BoxCategories })
  @Get('availability/center/category/month/formula')
  async getCenterAvailabilityByCategoryAndMonthAndFormula(
    @Query('center-id') centerId: string,
    @Query('box-category', new EnumValidationPipe(BoxCategories)) boxCategory: BoxCategories,
    @Query('date') strDate: string,
    @Query('formula') formulaLabel: string
  ): Promise<TBoxCategoryMonthAvailabilityMap> {
    let date = Date.asUTC(strDate, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    // TODO: remove this later
    // when a date is sent to us, it's supposed to be in UTC
    // but for backward compatibility sake, for now we accept french time
    // and so when french time is cast to utc, the resulting date has 2 excess hours to really be in UTC
    // and so, we remove those 2 hours
    date = new Date(date.getTime() - 2 * 60 * 60 * 1000)

    const availabilityMap = await this.bookingsService.getCenterBoxCategoryMonthAvailabilityBasedOnFormula(centerId, boxCategory, formulaLabel, date)

    // convert UTC to UTC+2
    for (const date in availabilityMap) {
      for (const boxId in availabilityMap[date]) {
        availabilityMap[date][boxId] = this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap[date][boxId])
      }
    }

    return availabilityMap
  }

  // by category
  /**
   * Get the availability of a center according a given category and month
   *
   * @param centerId The center id
   * @param boxCategory The box category
   * @param strDate The given date
   * @param excludePast Whether to exclude past slots
   * @returns The availability map of the center
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors du calcul des disponibilités',
  })
  @ApiParam({ name: 'box-category', enum: BoxCategories })
  @Get('availability/category/month')
  async getCenterAvailabilityByCategoryAndMonth(
    @Query('center-id') centerId: string,
    @Query('box-category', new EnumValidationPipe(BoxCategories)) boxCategory: BoxCategories,
    @Query('date') strDate: string,
    @Query('exclude-past', ParseBoolPipe) excludePast: boolean
  ): Promise<TBoxCategoryMonthAvailabilityMap> {
    const date = Date.asUTC(strDate, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    const availabilityMap = await this.bookingsService.getCategoryAvailabilityByMonth(centerId, boxCategory, date, excludePast)

    // convert UTC to UTC+2
    for (const date in availabilityMap) {
      for (const boxId in availabilityMap[date]) {
        availabilityMap[date][boxId] = this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap[date][boxId])
      }
    }

    return availabilityMap
  }

  /**
   * Get the availability of a center according a given category and date
   *
   * @param centerId The center id
   * @param boxCategory The box category
   * @param strDate The given date
   * @param excludePast Whether to exclude past slots
   * @returns The availability map of the center
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiParam({ name: 'box-category', enum: BoxCategories })
  @Get('availability/category/date')
  async getCenterAvailabilityByCategoryAndDate(
    @Query('center-id') centerId: string,
    @Query('box-category', new EnumValidationPipe(BoxCategories)) boxCategory: BoxCategories,
    @Query('date') strDate: string,
    @Query('exclude-past', ParseBoolPipe) excludePast: boolean
  ): Promise<TBoxesDateAvailabilityMap> {
    const date = Date.asUTC(strDate, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    const availabilityMap = await this.bookingsService.getCategoryAvailabilityByDate(centerId, boxCategory, date, excludePast)

    // convert UTC to UTC+2
    for (const boxId in availabilityMap) {
      availabilityMap[boxId] = this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap[boxId])
    }

    return availabilityMap
  }

  // by box
  /**
   * Get the availability of a box for a given week
   * @param boxId The box id
   * @param firstDayOfWeek The first day of the week
   * @param excludePast Whether to exclude past slots
   * @returns The availability map of the box
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors du calcul des disponibilités',
  })
  @Get('availability/box/week')
  async getBoxAvailabilityByWeek(
    @Query('box-id') boxId: string,
    @Query('first-day-of-week') firstDayOfWeek: string,
    @Query('exclude-past', ParseBoolPipe) excludePast: boolean
  ): Promise<TBoxWeekAvailabilityMap> {
    const date = Date.asUTC(firstDayOfWeek, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    const availabilityMap = await this.bookingsService.getBoxAvailabilityByWeek(boxId, date, excludePast)

    // convert UTC to UTC+2
    for (const date in availabilityMap) {
      availabilityMap[date] = this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap[date])
    }

    return availabilityMap
  }

  /**
   * Get the availability of a box for a specific date
   *
   * @param boxId The box id
   * @param strDate The given date
   * @param excludePast Whether to exclude past slots
   * @returns The availability map of the box
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des disponibilités' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur inconnue est survenue lors de la récupération des réservations en cours',
  })
  @Get('availability/box/date')
  async getBoxAvailabilityByDate(
    @Query('box-id') boxId: string,
    @Query('date') strDate: string,
    @Query('exclude-past', ParseBoolPipe) excludePast: boolean
  ): Promise<TBoxDateAvailabilityMap> {
    const date = Date.asUTC(strDate, 'dd-MM-yyyy')
    if (!date) throw new BadRequestException('Invalid date')

    const availabilityMap = await this.bookingsService.getBoxAvailabilityByDate(boxId, date, excludePast)

    // convert UTC to UTC+2
    return this.convertTimeSlotsFromUTCToUTCPlus2(availabilityMap)
  }

  /* GETTERS & SETTERS */
  /**
   * Get the bookings of a user
   *
   * @param loggedUser The logged user, resolved by the AuthGuard
   * @returns The bookings of the user
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des réservations', type: [BookingToBookerResponse], isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Boxe(s) introuvable(s)' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre(s) introuvable(s)' })
  @AuthApiDecorators(AuthType.JWT)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getBookingsAsBooker(@Request() { user: loggedUser }: RequestWithLoggedUser): Promise<BookingToBookerResponse[]> {
    const bookings = await this.bookingsService.getBookingsFromUser(loggedUser._id.toString())
    const bookingsResponse: BookingToBookerResponse[] = []

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers(bookings)

    for (const booking of bookings) {
      const { box, center } = data[booking._id.toString()]

      bookingsResponse.push(new BookingToBookerResponse(booking, box, center))
    }

    return bookingsResponse
  }

  /**
   * Get a booking by its id as a user
   *
   * @param loggedUser The logged user, resolved by the AuthGuard
   * @param bookingId The booking id
   * @returns The retrieved booking of the user
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la réservation', type: BookingToBookerResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Get('me/:BOOKING_ID')
  @UseGuards(JwtAuthGuard)
  async getBookingByIdAsBooker(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('BOOKING_ID') bookingId: string
  ): Promise<BookingToBookerResponse> {
    const booking = await this.bookingsService.getUserBookingById(loggedUser._id.toString(), bookingId)

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers([booking])
    const { box, center } = data[booking._id.toString()]

    return new BookingToBookerResponse(booking, box, center)
  }

  /**
   * Cancel a booking by its id as a user
   *
   * @param loggedUser The logged user, resolved by the AuthGuard
   * @param bookingId The booking id
   * @returns A message response indicating the success of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Réservation annulée', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Put('me/:BOOKING_ID/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBookingAsBooker(
    @Request() { user: loggedUser }: RequestWithLoggedUser,
    @Param('BOOKING_ID') bookingId: string
  ): Promise<MessageResponse> {
    await this.bookingsService.cancelUserBooking(loggedUser._id.toString(), bookingId)
    return new MessageResponse(HttpStatus.OK, 'Réservation annulée')
  }

  /*
   * ADMIN
   */
  /**
   * Create a booking as an admin.
   *
   * @param request The request body
   * @returns The created booking
   */
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Réservation créée avec succès', type: BookingToAdminResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Aucun boxe disponible ne répond à votre requête' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Formule(s) introuvable(s)' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Code promotionnel déjà utilisé' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "L'heure de début doit être au format 'HH:mm'" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "L'heure de début doit représenter une tranche de 15 minutes. (ex: 08:00 | 08:15 | 08:30 | 08:45)",
  })
  @AuthApiDecorators(AuthType.JWT)
  @Post('admin')
  @UseGuards(AdminJwtAuthGuard)
  async createAdminBooking(@Body() request: CreateBookingAdminRequest): Promise<BookingToAdminResponse> {
    // create booking
    // TODO: remove french time conversion later
    const twoHoursInMs = 2 * 60 * 60 * 1000
    const utcTimeFrom = new Date(request.from.getTime() - twoHoursInMs)
    const utcTimeTo = new Date(request.to.getTime() - twoHoursInMs)

    const booking = await this.bookingsService.createAdminBooking(
      request.boxId,
      request.bookingType,
      request.bookerName,
      request.bookerLastName,
      request.bookerPhone,
      utcTimeFrom,
      utcTimeTo,
      request.needAdvices,
      request.priceTTC,
      request.paymentStatus,
      request.vmcService,
      request.bookerEmail,
      request.bookerBillingName,
      request.vmcWorkerId,
      request.bookingGoal,
      request.teamComment
    )

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers([booking])
    const { box, center, vmcWorker } = data[booking._id.toString()]

    return new BookingToAdminResponse(booking, box, center, vmcWorker)
  }

  /* @Get("toXlsx")
    @UseGuards(AdminJwtAuthGuard)
    async getBookingsAsXlsx(@Request() { user: loggedUser }: LoggedUserWrapper  ): ResponseEntity<ByteArrayResource> {

        // create the file
        const (fileName, report) = await this.bookingsService.generateXlsx()

        // return it
        return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=$fileName")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(ByteArrayResource(report))
    } */

  /**
   * Get all bookings as an admin.
   *
   * @returns All bookings
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de toutes les réservations', type: [BookingToAdminResponse], isArray: true })
  @AuthApiDecorators(AuthType.JWT)
  @Get('all')
  @UseGuards(AdminJwtAuthGuard)
  async getAllBookings(): Promise<BookingToAdminResponse[]> {
    const bookings = await this.bookingsService.getAllBookings()
    const bookingsResponse: BookingToAdminResponse[] = []

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers(bookings)

    for (const booking of bookings) {
      const { box, center, vmcWorker } = data[booking._id.toString()]

      bookingsResponse.push(new BookingToAdminResponse(booking, box, center, vmcWorker))
    }

    return bookingsResponse
  }

  /**
   * Get all bookings of a center as an admin.
   *
   * @param centerId The center id
   * @returns All bookings of the center
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération des réservations du centre', type: [BookingToAdminResponse], isArray: true })
  @AuthApiDecorators(AuthType.JWT)
  @Get('by-center/:CENTER_ID')
  @UseGuards(AdminJwtAuthGuard)
  async getAllCenterBookings(@Param('CENTER_ID') centerId: string): Promise<BookingToAdminResponse[]> {
    const bookings = await this.bookingsService.getAllCenterBookings(centerId)

    const bookingsResponse: BookingToAdminResponse[] = []

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers(bookings)

    for (const booking of bookings) {
      const { box, center, vmcWorker } = data[booking._id.toString()]

      bookingsResponse.push(new BookingToAdminResponse(booking, box, center, vmcWorker))
    }

    return bookingsResponse
  }

  /**
   * Get all bookings of a center created these 3 last months as an admin.
   *
   * @param centerId The center id
   * @returns All bookings of the center created these 3 last months
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération des réservations du centre créées ces 3 derniers mois',
    type: [BookingToAdminResponse],
    isArray: true,
  })
  @AuthApiDecorators(AuthType.JWT)
  @Get('by-center/:CENTER_ID/last-3-months')
  @UseGuards(AdminJwtAuthGuard)
  async get3LastMonthsCenterBookings(@Param('CENTER_ID') centerId: string): Promise<BookingToAdminResponse[]> {
    const bookings = await this.bookingsService.get3LastMonthCenterBookings(centerId)

    const bookingsResponse: BookingToAdminResponse[] = []

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers(bookings)

    for (const booking of bookings) {
      const { box, center, vmcWorker } = data[booking._id.toString()]

      bookingsResponse.push(new BookingToAdminResponse(booking, box, center, vmcWorker))
    }

    return bookingsResponse
  }

  /**
   * Get all bookings of a center created these 3 last months as an admin.
   *
   * @param centerId The center id
   * @param from The start date
   * @param to The end date
   * @param boxCategory The box category
   * @returns All bookings of the center created these 3 last months
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Récupération des réservations du centre ayant lieu entre les dates fournises dans les boxes des catégories demandée',
    type: [BookingToAdminResponse],
    isArray: true,
  })
  @AuthApiDecorators(AuthType.JWT)
  @Get('by-center/:CENTER_ID/dates-and-categories')
  @UseGuards(AdminJwtAuthGuard)
  async getCenterBookingsForDatesAndCategories(
    @Param('CENTER_ID') centerId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('box-category', new EnumValidationPipe(BoxCategories, { optional: true })) boxCategory?: BoxCategories
  ): Promise<BookingToAdminResponse[]> {
    const fromDate = DatesUtils.getUTCDateFromStr(from, 'dd-MM-yyyy')
    const toDate = DatesUtils.getUTCDateFromStr(to, 'dd-MM-yyyy')

    if (!fromDate || !toDate) throw new BadRequestException('Format de date invalide. (attendu: "dd-MM-yyyy")')

    const bookings = await this.bookingsService.getCenterBookingsForDatesAndCategories(centerId, fromDate, toDate, boxCategory)

    const bookingsResponse: BookingToAdminResponse[] = []

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers(bookings)

    for (const booking of bookings) {
      const { box, center, vmcWorker } = data[booking._id.toString()]

      bookingsResponse.push(new BookingToAdminResponse(booking, box, center, vmcWorker))
    }

    return bookingsResponse
  }

  /**
   * Get the information of a booking by its id and at a specific slot.
   *
   * @param boxId The box id
   * @param strSlot The slot
   * @returns The retrieved booking
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la réservation', type: BookingToAdminResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Date invalide' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation(s) introuvable(s)' })
  @AuthApiDecorators(AuthType.JWT)
  @Get('at-slot')
  @UseGuards(AdminJwtAuthGuard)
  async getBookingByBoxIdAndSlot(@Query('box-id') boxId: string, @Query('slot') strSlot: string): Promise<BookingToAdminResponse> {
    if (!strSlot) throw new BadRequestException('Slot requis')
    let slot = Date.asUTC(strSlot, 'dd/MM/yyyy HH:mm')
    if (!slot) throw new BadRequestException('Invalid date')
    // TODO: remove this later
    // when a date is sent to us, it's supposed to be in UTC
    // but for backward compat sake, for now we accept french time
    // and so when french time is cast to utc, the resulting date has 2 excess hours to really
    // and so, we remove those 2 hours
    slot = new Date(slot.getTime() - 2 * 60 * 60 * 1000)

    const booking = await this.bookingsService.getBookingByBoxIdAndSlot(boxId, slot)

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers([booking])
    const { box, center, vmcWorker } = data[booking._id.toString()]

    return new BookingToAdminResponse(booking, box, center, vmcWorker)
  }

  /**
   * Get the information of a booking by its id.
   *
   * @param bookingId The booking id
   * @returns The retrieved booking
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération de la réservation', type: BookingToAdminResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation introuvable' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Get(':BOOKING_ID')
  @UseGuards(AdminJwtAuthGuard)
  async getBookingByIdAsAdmin(@Param('BOOKING_ID') bookingId: string): Promise<BookingToAdminResponse> {
    const booking = await this.bookingsService.getBookingById(bookingId)

    const data = await this.bookingsService.getBookingsRelatedBoxesAndCentersAndVmcWorkers([booking])
    const { box, center, vmcWorker } = data[booking._id.toString()]

    return new BookingToAdminResponse(booking, box, center, vmcWorker)
  }

  /**
   * Transfer the booking to another box.
   *
   * @param bookingId The booking id
   * @param newBoxId The new box id
   * @returns A message response indicating the success of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Récupération transférée', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Les 2 boxes sélectionnés ne sont pas dans le même centre',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Post('transfer-to')
  @UseGuards(AdminJwtAuthGuard)
  async transferBookingToAnotherBox(@Query('booking-id') bookingId: string, @Query('new-box-id') newBoxId: string): Promise<MessageResponse> {
    await this.bookingsService.transferBookingToAnotherBoxById(bookingId, newBoxId)

    return new MessageResponse(HttpStatus.OK, 'Réservation transférée')
  }

  /**
   * Update the booking as an admin.
   *
   * @param request The request body
   * @returns A message response indicating the success of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Réservation mise à jour', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Post('update')
  @UseGuards(AdminJwtAuthGuard)
  async updateBooking(@Body() request: UpdateBookingAdminRequest): Promise<MessageResponse> {
    await this.bookingsService.updateBookingByAdmin(request.bookingId, request.paymentStatus, request.goal, request.teamComment)

    return new MessageResponse(HttpStatus.OK, 'Réservation mise à jour')
  }

  /**
   * Validate the booking as an admin.
   *
   * @param bookingId The booking id
   * @returns A message response indicating the success of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Réservation validée', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation introuvable' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @AuthApiDecorators(AuthType.JWT)
  @Post(':BOOKING_ID/validate')
  @UseGuards(AdminJwtAuthGuard)
  async validateBookingAdmin(@Param('BOOKING_ID') bookingId: string): Promise<MessageResponse> {
    await this.bookingsService.validateBookingAsAdmin(bookingId)

    return new MessageResponse(HttpStatus.OK, 'Réservation validée')
  }

  /**
   * Cancel the booking as an admin.
   * If the booking is already validated, the user will be refunded.
   *
   * @param loggedUser The logged user, resolved by the AuthGuard
   * @param bookingId The booking id
   * @returns A message response indicating the success of the operation
   */
  @ApiResponse({ status: HttpStatus.OK, description: 'Réservation supprimée', type: MessageResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Réservation introuvable' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Centre introuvable' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Box introuvable' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Le remboursement a échoué pour une raison inconnue. Veuillez contacter un administrateur',
  })
  @AuthApiDecorators(AuthType.JWT)
  @Put(':BOOKING_ID/cancel')
  @UseGuards(AdminJwtAuthGuard)
  async cancelBookingAdmin(@Request() { user: loggedUser }: RequestWithLoggedUser, @Param('BOOKING_ID') bookingId: string): Promise<MessageResponse> {
    // cancel it
    await this.bookingsService.cancelBookingAsAdmin(loggedUser._id.toString(), bookingId)

    return new MessageResponse(HttpStatus.OK, 'Réservation supprimée')
  }

  /**
   * Converts the time slots from UTC to UTC+2.
   *
   * @param availabilityMap The availability map to convert
   * @returns The converted availability map
   * @private
   */
  private convertTimeSlotsFromUTCToUTCPlus2(availabilityMap: TBoxDateAvailabilityMap): TBoxDateAvailabilityMap {
    const convertedMap: TBoxDateAvailabilityMap = {}
    Object.keys(availabilityMap).forEach((key) => {
      const frenchTime = this.convertTimeFromUTCToFrenchTZ(key)
      convertedMap[frenchTime] = availabilityMap[key]
    })

    return convertedMap
  }

  /**
   * Converts the time slot from UTC+2 (French timezone) to UTC.
   *
   * @param time The time to convert
   * @returns The converted time
   * @private
   */
  private convertTimeFromFrenchTZToUTC(time: string): string {
    const [frenchHours, minutes]: [number, string] = time.split(':').map((value, index) => (index === 0 ? parseInt(value) : value)) as [
      number,
      string
    ]

    const utcHours = frenchHours - 2
    const formatedHours = utcHours < 10 ? '0' + utcHours : utcHours

    return `${formatedHours}:${minutes}`
  }

  /**
   * Converts the time slot from UTC to UTC+2 (French timezone).
   * The difference beetween {@link convertTimeFromUTCToFrenchTZ} and {@link convertTimeFromFrenchTZToUTC} is that
   *  {@link convertTimeFromUTCToFrenchTZ} converts a map of time slots,
   *  and {@link convertTimeFromFrenchTZToUTC} converts a single time slot.
   *
   * @param time The time to convert
   * @returns The converted time
   * @private
   */
  private convertTimeFromUTCToFrenchTZ(time: string): string {
    const [UTCHours, minutes]: [number, string] = time.split(':').map((value, index) => (index === 0 ? parseInt(value) : value)) as [number, string]

    const frenchHours = UTCHours + 2
    const formatedHours = frenchHours < 10 ? '0' + frenchHours : frenchHours

    return `${formatedHours}:${minutes}`
  }
}
