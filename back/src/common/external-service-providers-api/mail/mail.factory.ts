import { ConfigService } from '@nestjs/config'
import { ProfessionalUser, User } from '@Schemas/user'
import { MailTemplateIds } from '@/common/enums/external-APIs/mail.provider.enum'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'
import { Vehicle } from '@/schemas/vehicle'

/**
 * Represents a factory to create mails that generates instances of mail templates.
 * The generic type `T` represents the type of the generated mail template.
 */
export interface IMailFactory<T> {
  // Auth
  /**
   * Creates a validation email template for a user.
   * @param user  The user for whom the email template is created.
   * @param token The validation token associated with the user.
   * @returns An instance of the validation email template.
   */
  createValidationMail(user: User, token: TToken): T

  /**
   * Creates a password recovery email template for a user.
   * @param user  The user for whom the email template is created.
   * @param token The recovery token associated with the user.
   * @returns An instance of the password recovery email template.
   */
  createPasswordRecoveryEmail(user: User, token: TToken): T

  // Bookings
  /**
   * Creates a canceled booking email template for a booker.
   * @param bookerName  The name of the booker.
   * @param bookerEmail The email of the booker.
   * @param centerName  The name of the booking center.
   * @returns An instance of the booking canceled email template.
   */
  createBookingCanceledEmail(bookerName: string, bookerEmail: string, centerName: string): T

  /**
   * Creates a validated booking email template for a booker.
   * @param bookingId   The ID of the validated booking.
   * @param bookerName  The name of the booker.
   * @param bookerEmail The email of the booker.
   * @param centerName  The name of the booking center.
   * @returns An instance of the booking validated email template.
   */
  createBookingValidatedEmail(bookingId: string, bookerName: string, bookerEmail: string, centerName: string): T

  /**
   * Creates a created booking email template for a user.
   * @param bookingData The data associated with the booking.
   * @param bookerEmail The email of the booker.
   * @param centerName  The name of the booking center.
   * @returns An instance of the booking created email template.
   */
  createBookingCreatedToUserEmail(bookingData: { id: string; createdAt: Date; begin: Date }, bookerEmail: string, centerName: string): T

  /**
   * Creates a created booking email template for an admin.
   * @param bookingData The data associated with the booking.
   * @param bookerData  The data associated with the booker.
   * @param centerName  The name of the booking center.
   * @returns An instance of the booking created email template.
   */
  createBookingCreatedToAdminEmail(
    bookingData: { id: string; createdAt: Date; begin: Date },
    bookerData: { name: string; lastName: string; email: string; id?: string },
    centerName: string
  ): T

  /**
   * Creates a new mission received email template for a professional.
   * @param missionId The id of the new mission.
   * @param professionalEmail The email address of the professional who received the mission
   * @param professionalName  The name of the professional who received the mission
   * @param clientName  The name of the client who created the mission
   * @returns An instance of the new mission received email template.
   */
  createNewMissionReceivedToProfessionalEmail(missionId: string, professionalEmail: string, professionalName: string, clientName: string): T

  /**
   * Creates a new mission created email template for the client.
   * @param missionId the id of the new mission
   * @param clientName the name of the client who created the mission
   * @param clientEmail the email address of the client
   * @param vehicle the vehicle the mission is for
   * @param selectedProfessionalsAmount the number of professionals who received the mission
   */
  createNewMissionCreatedToClientEmail(
    missionId: string,
    clientName: string,
    clientEmail: string,
    vehicle: Vehicle,
    selectedProfessionalsAmount: number
  ): MailDataRequired

  /**
   * Creates a new mission canceled email template for the client.
   * @param client the client who created the mission
   * @param vehicle the vehicle the mission is for
   */
  createMissionCanceledToClientEmail(client: User, vehicle: Vehicle): MailDataRequired

  /**
   * Creates a new mission canceled email template for the client.
   * @param professional an active professional of the mission
   * @param vehicle the vehicle the mission is for
   */
  createMissionCanceledToActiveProfessionalEmail(professional: ProfessionalUser, vehicle: Vehicle): MailDataRequired

  /**
   * Creates a new professional with pending quote refused mission email template for the client.
   * @param vehicle the vehicle the mission is for
   * @param client the client who created the mission
   * @param refusingProfessional the professional refusing the mission
   */
  createProfessionalWithPendingQuoteRefusedMissionToClientEmail(
    vehicle: Vehicle,
    client: User,
    refusingProfessional: ProfessionalUser
  ): MailDataRequired

  /**
   * Creates a new professional sent a pending quote email template for the client.
   * @param vehicle the vehicle the mission is for
   * @param client the client who created the mission
   * @param professional the professional that sent the pending quote
   */
  createMissionNewQuoteReceivedToClientEmail(vehicle: Vehicle, client: User, professional: ProfessionalUser): MailDataRequired

  /**
   * Creates a new message received email template for the receiver.
   * @param vehicle the vehicle the mission is for
   * @param senderName the name of the sender
   * @param receiver the receiving user
   */
  createMissionNewMessageToReceiverEmail(vehicle: Vehicle, senderName: string, receiver: User): MailDataRequired

  /**
   * Creates a client chose another professional email template for the professional.
   * @param vehicle the vehicle the mission is for
   * @param professionalEmail the email of the professional
   * @param professionalName the name of the professional
   */
  createMissionClientChoseAnotherProfessionalEmail(vehicle: Vehicle, professionalEmail: string, professionalName: string): MailDataRequired

  /**
   * Creates a mission complete email template for the client
   * @param missionId The id of the mission
   * @param clientEmail The email of the mission client
   * @param professionalName The name of the mission professional
   */
  createMissionCompletedToClientEmail(missionId: string, clientEmail: string, professionalName: string): MailDataRequired

  /**
   * creates a mission validated by client email template for the client
   * @param clientEmail The email address of the client
   * @param vehicle The vehicle the mission was for
   * @param clientName The name of the client
   * @param professionalName The name of the professional who completed the mission
   * @param invoiceFile The invoice file
   */
  createMissionInvoiceToClientEmail(
    clientEmail: string,
    vehicle: Vehicle,
    clientName: string,
    professionalName: string,
    invoiceFile: TFile
  ): MailDataRequired

  /**
   * Creates a mission validated by client email template for the professional
   * @param professionalEmail The email of the professional
   * @param clientName The client name
   * @param invoiceFile The invoice file
   */
  createMissionValidatedByClientToProfessionalEmail(professionalEmail: string, clientName: string, invoiceFile: TFile): MailDataRequired

  /**
   * Creates a mission not validated by client email template for the admin
   * @param missionId The id of the mission
   * @param client The client user
   * @param professional The professional user
   * @param reason The reason why the client do not validate the mission
   */
  createMissionClientOpenDisputeToAdminEmail(missionId: string, client: User, professional: ProfessionalUser, reason: string): MailDataRequired

  /**
   * Creates an email-change email template for the old mail.
   *
   * @param requesterData The data associated with the requester.
   * @returns An instance of the email-change email template.
   */
  createEmailChangeEmailForOldMail(requesterData: { email: string; name: string }): T

  /**
   * Creates an email-change email template for the new mail.
   *
   * @param requesterData The data associated with the requester.
   * @param token        The token associated with the new mail.
   * @returns An instance of the email-change email template.
   */
  createEmailChangeEmailForNewMail(requesterData: { newEmail: string; name: string }, token: TToken): T

  // ... define other methods for other types of mail templates
}

/**
 * Implementation of {@link IMailFactory} for SendGrid mail API.
 */
export class SendGridMailFactory implements IMailFactory<MailDataRequired> {
  private readonly domainUrl: string
  private readonly adminMail: string
  private readonly fromData: { email: string; name: string }

  constructor(configService: ConfigService) {
    this.domainUrl = <string>configService.get<string>('DOMAIN_FRONT')
    this.adminMail = <string>configService.get<string>('ADMIN_MAIL')

    this.fromData = {
      email: <string>configService.get<string>('ADMIN_MAIL'),
      name: <string>configService.get<string>('ADMIN_NAME'),
    }
  }

  /* > ==== AUTH ====> */
  public createValidationMail(user: User, token: TToken): MailDataRequired {
    return this.createEmail(user.email, MailTemplateIds.USER_VALIDATION, { name: user.name, env_url: this.domainUrl, validation: token })
  }

  public createPasswordRecoveryEmail(user: User, token: TToken): MailDataRequired {
    return this.createEmail(user.email, MailTemplateIds.PASSWORD_RECOVERY, { name: user.name, env_url: this.domainUrl, token: token })
  }

  /* > ==== BOOKINGS ====> */
  public createBookingCanceledEmail(bookerName: string, bookerEmail: string, centerName: string): MailDataRequired {
    return this.createEmail(bookerEmail, MailTemplateIds.BOOKING_CANCELED, { name: bookerName, valueCenterName: centerName })
  }

  public createBookingValidatedEmail(bookingId: string, bookerName: string, bookerEmail: string, centerName: string): MailDataRequired {
    // TODO: Rajouter la facture en pièce jointe !
    return this.createEmail(bookerEmail, MailTemplateIds.BOOKING_VALIDATED, { name: bookerName, valueCenterName: centerName, bookingId })
  }

  public createBookingCreatedToUserEmail(
    bookingData: { id: string; createdAt: Date; begin: Date },
    bookerEmail: string,
    centerName: string
  ): MailDataRequired {
    const beginHours = bookingData.begin.getUTCHours() + 2
    const beginMinutes = bookingData.begin.getUTCMinutes()

    // 'HH:mm' format
    const formattedBookingBeginTime = `${beginHours < 10 ? '0' : ''}${beginHours}:${beginMinutes < 10 ? '0' : ''}${beginMinutes}`

    // TODO: Rajouter la facture en pièce jointe !
    return this.createEmail(bookerEmail, MailTemplateIds.BOOKING_CREATED_TO_USER, {
      valueCenterName: centerName,
      bookingId: bookingData.id,
      bookingDate: bookingData.createdAt.toLocaleDateString('fr-fr'),
      bookingTime: formattedBookingBeginTime,
    })
  }

  public createBookingCreatedToAdminEmail(
    bookingData: { id: string; createdAt: Date; begin: Date },
    bookerData: { name: string; lastName: string; email: string; id?: string },
    centerName: string
  ): MailDataRequired {
    const beginHours = bookingData.begin.getHours()
    const beginMinutes = bookingData.begin.getMinutes()

    // 'HH:mm' format
    const formattedBookingBeginTime = `${beginHours < 10 ? '0' : ''}${beginHours}:${beginMinutes < 10 ? '0' : ''}${beginMinutes}`

    const bookerFullName = `${bookerData.name} ${bookerData.lastName}` + (bookerData.id ? ` (#${bookerData.id})` : '')

    return this.createEmail(this.adminMail, MailTemplateIds.BOOKING_CREATED_TO_ADMIN, {
      booker: bookerFullName,
      valueCenterName: centerName,
      bookingDate: bookingData.createdAt.toLocaleDateString('eu-EU'),
      bookingTime: formattedBookingBeginTime,
    })
  }

  /* >==== MISSIONS ====> */

  public createNewMissionReceivedToProfessionalEmail(
    missionId: string,
    professionalEmail: string,
    professionalName: string,
    clientName: string
  ): MailDataRequired {
    return this.createEmail(professionalEmail, MailTemplateIds.MISSION_RECEIVED_TO_PROFESSIONAL, {
      name: professionalName,
      clientName,
      missionId,
      env_url: this.domainUrl,
    })
  }

  public createNewMissionCreatedToClientEmail(
    missionId: string,
    clientName: string,
    clientEmail: string,
    vehicle: Vehicle,
    selectedProfessionalsAmount: number
  ): MailDataRequired {
    return this.createEmail(clientEmail, MailTemplateIds.MISSION_CREATED_TO_CLIENT, {
      name: clientName,
      selectedProfessionalsAmount,
      missionId,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
      env_url: this.domainUrl,
    })
  }

  public createMissionCanceledToClientEmail(client: User, vehicle: Vehicle): MailDataRequired {
    return this.createEmail(client.email, MailTemplateIds.MISSION_CANCELED_TO_CLIENT, {
      name: client.name,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createMissionCanceledToActiveProfessionalEmail(professional: ProfessionalUser, vehicle: Vehicle): MailDataRequired {
    return this.createEmail(professional.email, MailTemplateIds.MISSION_CANCELED_TO_PROFESSIONAL, {
      name: professional.name,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createProfessionalWithPendingQuoteRefusedMissionToClientEmail(
    vehicle: Vehicle,
    client: User,
    refusingProfessional: ProfessionalUser
  ): MailDataRequired {
    return this.createEmail(client.email, MailTemplateIds.MISSION_PROFESSIONAL_WITH_PENDING_QUOTE_REFUSED_MISSION_TO_CLIENT, {
      name: client.name,
      professionalName: refusingProfessional.name,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createMissionNewQuoteReceivedToClientEmail(vehicle: Vehicle, client: User, professional: ProfessionalUser): MailDataRequired {
    return this.createEmail(client.email, MailTemplateIds.MISSION_NEW_PENDING_QUOTE_RECEIVED_TO_CLIENT, {
      env_url: this.domainUrl,
      name: client.name,
      professionalName: professional.name,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createMissionNewMessageToReceiverEmail(vehicle: Vehicle, senderName: string, receiver: User): MailDataRequired {
    return this.createEmail(receiver.email, MailTemplateIds.MISSION_NEW_MESSAGE, {
      env_url: this.domainUrl,
      name: receiver.name,
      senderName: senderName,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createMissionClientChoseAnotherProfessionalEmail(vehicle: Vehicle, professionalEmail: string, professionalName: string): MailDataRequired {
    return this.createEmail(professionalEmail, MailTemplateIds.MISSION_CLIENT_CHOSE_ANOTHER_PROFESSIONAL, {
      name: professionalName,
      vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`,
    })
  }

  public createMissionCompletedToClientEmail(missionId: string, clientEmail: string, professionalName: string): MailDataRequired {
    return this.createEmail(clientEmail, MailTemplateIds.MISSION_COMPLETED_TO_CLIENT, {
      professionalName,
      missionId,
      env_url: this.domainUrl,
    })
  }

  public createMissionInvoiceToClientEmail(
    clientEmail: string,
    vehicle: Vehicle,
    clientName: string,
    professionalName: string,
    invoiceFile: TFile
  ): MailDataRequired {
    return this.createEmail(
      clientEmail,
      MailTemplateIds.MISSION_VALIDATED_BY_CLIENT_TO_CLIENT,
      { name: clientName, vehicleInfo: `${vehicle.model} - ${vehicle.year} | ${vehicle.plate}`, professionalName },
      [invoiceFile]
    )
  }

  public createMissionValidatedByClientToProfessionalEmail(professionalEmail: string, clientName: string, invoiceFile: TFile): MailDataRequired {
    return this.createEmail(professionalEmail, MailTemplateIds.MISSION_VALIDATED_BY_CLIENT_TO_PROFESSIONAL, { clientName }, [invoiceFile])
  }

  public createMissionClientOpenDisputeToAdminEmail(
    missionId: string,
    client: User,
    professional: ProfessionalUser,
    reason: string
  ): MailDataRequired {
    return this.createEmail(this.adminMail, MailTemplateIds.MISSION_CLIENT_OPENED_DISPUTE_TO_ADMIN, {
      missionId,
      reason,
      clientFullName: client.getFullName(),
      clientEmail: client.email,
      clientPhone: client.phone,
      clientId: client._id.toString(),
      professionalFullName: professional.getFullName(),
      professionalEmail: professional.email,
      professionalPhone: professional.phone,
      professionalId: professional._id.toString(),
    })
  }

  public createEmailChangeEmailForNewMail(requesterData: { newEmail: string; name: string }, token: TToken): MailDataRequired {
    return this.createEmail(requesterData.newEmail, MailTemplateIds.MAIL_CHANGE_REQUEST_NEW, {
      name: requesterData.name,
      env_url: this.domainUrl,
      token: token,
    })
  }

  public createEmailChangeEmailForOldMail(requesterData: { email: string; name: string }): MailDataRequired {
    return this.createEmail(requesterData.email, MailTemplateIds.MAIL_CHANGE_REQUEST_OLD, { name: requesterData.name })
  }

  private createEmail(to: string, templateId: string, dynamicTemplateData?: object, attachments?: TFile[]): MailDataRequired {
    const formatedAttachements = attachments
      ? attachments.map((attachment) => ({ content: attachment.content, filename: attachment.name || 'Facture' }))
      : undefined

    return { to, from: this.fromData, templateId, attachments: formatedAttachements, personalizations: [{ to, dynamicTemplateData }] }
  }
}
