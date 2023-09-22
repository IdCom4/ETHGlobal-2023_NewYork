import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as SendGrid from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'
import { SendGridMailFactory } from '@Common/external-service-providers-api/mail/mail.factory'
import { ProfessionalUser, User } from '@Schemas/user'
import { Vehicle } from '@/schemas/vehicle'

/**
 * Represents the behavior of all mail API
 * and so abstract the implementation details of each possible mail API.
 *
 * A mail API is the entry point to an external mail service.
 * It is used to send emails.
 *
 * It has to use a Factory implemented by the {@link IMailFactory} interface
 * to generate a template of the email to be sent.
 */
export interface IMailAPI {
  /**
   * Sends a validation email to a user.
   * @param {User} user    The user to whom the email is being sent.
   * @param {TToken} token The validation token associated with the user.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendValidationMail(user: User, token: TToken): Promise<void>

  /**
   * Sends a password recovery email to a user.
   * @param {User} user    The user to whom the email is being sent.
   * @param {TToken} token The recovery token associated with the user.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendPasswordRecoveryEmail(user: User, token: TToken): Promise<void>

  /**
   * Sends a password recovery email to a user.
   * @param {User} user       The user to whom the email is being sent.
   * @param {String} newEmail The new email of the user.
   * @param {TToken} token    The recovery token associated with the user.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendEmailChangeEmails(user: User, newEmail: string, token: TToken): Promise<void>

  /**
   * Sends a validated booking email to a booker.
   * @param {String} bookingId   The ID of the validated booking.
   * @param {String} bookerName  The name of the booker.
   * @param {String} bookerEmail The email of the booker.
   * @param {String} centerName  The name of the booking center.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendBookingValidated(bookingId: string, bookerName: string, bookerEmail: string, centerName: string): Promise<void>

  /**
   * Sends a canceled booking email to a booker.
   * @param {String} bookerName  The name of the booker.
   * @param {String} bookerEmail The email of the booker.
   * @param {String} centerName  The name of the booking center.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendBookingCanceled(bookerName: string, bookerEmail: string, centerName: string): Promise<void>

  /**
   * Sends a created booking email to a booker.
   * @param bookingData The data associated with the booking.
   * @param bookerData  The data associated with the booker.
   * @param {String} centerName - The name of the booking center.
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendBookingCreatedEmail(
    bookingData: { id: string; createdAt: Date; begin: Date },
    bookerData: { name: string; lastName: string; email: string; id?: string },
    centerName: string
  ): Promise<void>

  /**
   * Sends a new mission received email to the client and selected professionals.
   * @param missionId The id of the new mission.
   * @param client The data of the client who created the mission.
   * @param vehicle The vehicle the mission is for
   * @param selectedProfessionals the array of selected professionals's data
   * @returns A Promise that resolves when the email is successfully sent.
   */
  sendNewMissionCreatedEmail(
    missionId: string,
    client: { name: string; email: string },
    vehicle: Vehicle,
    selectedProfessionals: { name: string; email: string }[]
  ): Promise<void>

  /**
   * Sends a mission canceled email to involved users
   * @param vehicle the vehicle the mission was for
   * @param client the client who created the mission
   * @param professionals the list of the remaining active professionals
   * @param canceledByClient if the mission was canceled by user choice or not
   */
  sendMissionCanceledEmail(vehicle: Vehicle, client: User, professionals: ProfessionalUser[], canceledByClient: boolean): Promise<void>

  /**
   * Sends an email to mission's client to let him known that a professional that had submited a pending quote has finaly refused the mission
   * @param vehicle the vehicle the mission was for
   * @param client the client who created the mission
   * @param refusingProfessional the professional refusing the mission
   */
  sendProfessionalWithPendingQuoteRefusedMissionToClient(vehicle: Vehicle, client: User, refusingProfessional: ProfessionalUser): Promise<void>

  /**
   * Sends an email to mission's client to let him known that a professional sent him a pending quote
   * @param vehicle the vehicle the mission is for
   * @param client the client who created the mission
   * @param professional the professional that sent the pending quote
   */
  sendMissionNewQuoteReceivedToClient(vehicle: Vehicle, client: User, professional: ProfessionalUser): Promise<void>

  /**
   * Sends an email to message's receiver about the new message
   * @param vehicle the vehicle the mission is for
   * @param senderName the name of the sender
   * @param receiver the user that received
   */
  sendMissionNewMessageToReceiver(vehicle: Vehicle, senderName: string, receiver: User): Promise<void>

  /**
   * Sends an email to the professional to let him know that he wasn't chosen for the mission
   * @param vehicle the vehicle the mission is for
   * @param professional the professional to alert
   */
  sendMissionClientChoseAnotherProfessional(vehicle: Vehicle, professional: ProfessionalUser): Promise<void>

  /**
   * Sends an email to the mission client to let him know that the mission is complete
   * @param missionId The id of the mission
   * @param clientEmail The email of the mission client
   * @param professionalName The name of the mission professional
   */
  sendMissionCompletedToClient(missionId: string, clientEmail: string, professionalName: string): Promise<void>

  /**
   * Sends an email to the admins to let them know that a mission client doesnt validate the mission
   * @param missionId The id of the mission
   * @param client The mission client
   * @param professional The mission professional
   * @param reason The reason why the client does not validate the mission
   */
  sendMissionClientOpenDisputeToAdmin(missionId: string, client: User, professional: ProfessionalUser, reason: string): Promise<void>

  /**
   * Sends an email to the mission client to ensure him that he validated the mission and give him its invoice
   *
   * @param clientEmail The email address of the client
   * @param vehicle The vehicle the mission was for
   * @param clientName The name of the client
   * @param professionalName The name of the professional who completed the mission
   * @param invoiceFile The invoice file
   */
  sendMissionInvoiceToClient(clientEmail: string, vehicle: Vehicle, clientName: string, professionalName: string, invoiceFile: TFile): Promise<void>

  /**
   * Sends an email to the mission professional to let him know that the client validated the mission
   * @param professionalEmail The email of the final professional
   * @param clientName The name of the client
   * @param invoiceFile The invoice file
   */
  sendMissionValidatedByClientToProfessional(professionalEmail: string, clientName: string, invoiceFile: TFile): Promise<void>
}

/**
 * Implementation of {@link IMailAPI} the SendGrid mail API.
 */
@Injectable()
export class SendGridMailAPI implements IMailAPI {
  private readonly mailFactory = new SendGridMailFactory(this.configService)
  protected readonly logger = new Logger(SendGridMailAPI.name)

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(<string>this.configService.get<string>('SEND_GRID_KEY'))
  }

  /* > ==== AUTH ====> */
  async sendValidationMail(user: User, token: TToken): Promise<void> {
    const mailData = this.mailFactory.createValidationMail(user, token)

    await this.send(mailData)
  }

  async sendPasswordRecoveryEmail(user: User, token: TToken): Promise<void> {
    const mailData = this.mailFactory.createPasswordRecoveryEmail(user, token)

    await this.send(mailData)
  }

  async sendEmailChangeEmails(user: User, newEmail: string, token: TToken): Promise<void> {
    const dataForOldMail = this.mailFactory.createEmailChangeEmailForOldMail(user)
    const dataForNewMail = this.mailFactory.createEmailChangeEmailForNewMail({ newEmail, name: user.name }, token)

    await this.send([dataForOldMail, dataForNewMail])
  }

  /* > ==== BOOKINGS ====> */
  async sendBookingCanceled(bookerName: string, bookerEmail: string, centerName: string): Promise<void> {
    const mailData = this.mailFactory.createBookingCanceledEmail(bookerName, bookerEmail, centerName)

    await this.send(mailData)
  }

  async sendBookingValidated(bookingId: string, bookerName: string, bookerEmail: string, centerName: string): Promise<void> {
    const mailData = this.mailFactory.createBookingValidatedEmail(bookingId, bookerName, bookerEmail, centerName)

    await this.send(mailData)
  }

  async sendBookingCreatedEmail(
    bookingData: { id: string; createdAt: Date; begin: Date },
    bookerData: { name: string; lastName: string; email: string; id?: string },
    centerName: string
  ): Promise<void> {
    const userMail = this.mailFactory.createBookingCreatedToUserEmail(bookingData, bookerData.email, centerName)
    const adminMail = this.mailFactory.createBookingCreatedToAdminEmail(bookingData, bookerData, centerName)

    await this.send([userMail, adminMail])
  }

  /* >==== MISSIONS ====> */
  async sendNewMissionCreatedEmail(
    missionId: string,
    client: { name: string; email: string },
    vehicle: Vehicle,
    selectedProfessionals: { name: string; email: string }[]
  ): Promise<void> {
    // create mails
    const clientMail = this.mailFactory.createNewMissionCreatedToClientEmail(
      missionId,
      client.name,
      client.email,
      vehicle,
      selectedProfessionals.length
    )
    const professionalsMails = selectedProfessionals.map((pro) =>
      this.mailFactory.createNewMissionReceivedToProfessionalEmail(missionId, pro.email, pro.name, client.name)
    )

    // send mails
    const mails = professionalsMails.concat(clientMail)
    await this.send(mails)
  }

  async sendMissionCanceledEmail(vehicle: Vehicle, client: User, professionals: ProfessionalUser[], canceledByClient: boolean): Promise<void> {
    // if user canceled the mission, alert the professionals
    if (canceledByClient) {
      const professionalsMails = professionals.map((pro) => this.mailFactory.createMissionCanceledToActiveProfessionalEmail(pro, vehicle))
      await this.send(professionalsMails)
    }
    // else it means that the mission was canceled by the last active professional refusing the mission
    // and so, alert the client
    else {
      const clientMail = this.mailFactory.createMissionCanceledToClientEmail(client, vehicle)
      await this.send(clientMail)
    }
  }

  async sendProfessionalWithPendingQuoteRefusedMissionToClient(
    vehicle: Vehicle,
    client: User,
    refusingProfessional: ProfessionalUser
  ): Promise<void> {
    const clientMail = this.mailFactory.createProfessionalWithPendingQuoteRefusedMissionToClientEmail(vehicle, client, refusingProfessional)

    await this.send(clientMail)
  }

  async sendMissionNewQuoteReceivedToClient(vehicle: Vehicle, client: User, professional: ProfessionalUser): Promise<void> {
    const clientMail = this.mailFactory.createMissionNewQuoteReceivedToClientEmail(vehicle, client, professional)

    await this.send(clientMail)
  }

  async sendMissionNewMessageToReceiver(vehicle: Vehicle, senderName: string, receiver: User): Promise<void> {
    const clientMail = this.mailFactory.createMissionNewMessageToReceiverEmail(vehicle, senderName, receiver)

    await this.send(clientMail)
  }

  async sendMissionClientChoseAnotherProfessional(vehicle: Vehicle, professional: ProfessionalUser): Promise<void> {
    const mail = this.mailFactory.createMissionClientChoseAnotherProfessionalEmail(vehicle, professional.email, professional.name)

    await this.send(mail)
  }

  async sendMissionCompletedToClient(missionId: string, clientEmail: string, professionalName: string): Promise<void> {
    const mail = this.mailFactory.createMissionCompletedToClientEmail(missionId, clientEmail, professionalName)

    await this.send(mail)
  }

  async sendMissionInvoiceToClient(
    clientEmail: string,
    vehicle: Vehicle,
    clientName: string,
    professionalName: string,
    invoiceFile: TFile
  ): Promise<void> {
    const mail = this.mailFactory.createMissionInvoiceToClientEmail(clientEmail, vehicle, clientName, professionalName, invoiceFile)

    await this.send(mail)
  }

  async sendMissionValidatedByClientToProfessional(professionalEmail: string, clientName: string, invoiceFile: TFile): Promise<void> {
    const mail = this.mailFactory.createMissionValidatedByClientToProfessionalEmail(professionalEmail, clientName, invoiceFile)

    await this.send(mail)
  }

  async sendMissionClientOpenDisputeToAdmin(missionId: string, client: User, professional: ProfessionalUser, reason: string): Promise<void> {
    const mail = this.mailFactory.createMissionClientOpenDisputeToAdminEmail(missionId, client, professional, reason)

    await this.send(mail)
  }

  protected async send(mail: MailDataRequired | MailDataRequired[]): Promise<boolean> {
    try {
      await SendGrid.send(mail)
      return true
    } catch (error) {
      if (Array.isArray(mail)) {
        const mailData = mail.map((_m) => `[${_m.templateId} => ${_m.to}]`).reduce((prev, curr) => `${prev + curr}\n`, '\n')
        this.logger.error(`An error occured while sending mails (${mailData})`, error)
      } else this.logger.error(`An error occured while sending a mail (templateId: ${mail.templateId}) to: ${mail.to}`, error)
      return false
    }
  }
}
