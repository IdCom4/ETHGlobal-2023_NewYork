import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PaymentAPI, TDocumentData } from '@/common/external-service-providers-api/payment/payment.api'
import { UserRepository } from '@/repositories'
import { ProfessionalUser, User } from '@/schemas/user'
import { VmcCompaniesKeyNames } from '@/common/enums/payments'
import { Mission } from '@/schemas/mission'
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception'

@Injectable()
export class PaymentsService {
  constructor(@Inject('PaymentAPI') private readonly paymentAPI: PaymentAPI, private readonly userRepository: UserRepository) {}

  public async createAndSaveAllUserCustomerIds(user: User): Promise<Record<VmcCompaniesKeyNames, string>> {
    if (!user.missionClientProfile.customerId) {
      const customerIdMissionClient = await this.paymentAPI
        .createCustomer(user, VmcCompaniesKeyNames.PLATEFORME)
        .getOrThrow(new InternalServerErrorException('Une erreur est survenue lors de la création du compte client'))

      user.missionClientProfile.setCustomerId(customerIdMissionClient)
    }

    if (!user.centerClientProfile.customerId) {
      const customerIdCenterClient = await this.paymentAPI
        .createCustomer(user, VmcCompaniesKeyNames.CENTER)
        .getOrThrow(new InternalServerErrorException('Une erreur est survenue lors de la création du compte client'))

      user.centerClientProfile.setCustomerId(customerIdCenterClient)
    }

    this.userRepository.updateAsIs(user)

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [VmcCompaniesKeyNames.PLATEFORME]: user.missionClientProfile.customerId!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [VmcCompaniesKeyNames.CENTER]: user.centerClientProfile.customerId!,
    }
  }

  public async getOrCreateAndSaveCustomerIds(user: User): Promise<Record<VmcCompaniesKeyNames, string>> {
    if (!user.missionClientProfile.customerId || !user.centerClientProfile.customerId) return this.createAndSaveAllUserCustomerIds(user)

    return {
      [VmcCompaniesKeyNames.PLATEFORME]: user.missionClientProfile.customerId,
      [VmcCompaniesKeyNames.CENTER]: user.centerClientProfile.customerId,
    }
  }

  public async updateOrCreateAndSavePaymentAccountByToken(
    professional: ProfessionalUser,
    accountToken?: string,
    iban?: string,
    identityDocumentRecto?: string,
    identityDocumentVerso?: string,
    birthday?: Date
  ): Promise<string> {
    let accountId = professional.professionalProfile.professionalPaymentData.accountId

    if (accountToken) {
      if (accountId) {
        const response = await this.paymentAPI.updateAccount(accountId, accountToken, VmcCompaniesKeyNames.PLATEFORME)
        professional.professionalProfile.professionalPaymentData.setPastDue(response.pastDue)
      } else {
        const response = await this.paymentAPI.createAccount(professional, accountToken, VmcCompaniesKeyNames.PLATEFORME)
        accountId = response.accountId
        professional.professionalProfile.professionalPaymentData.setAccountId(response.accountId)
        professional.professionalProfile.professionalPaymentData.setPastDue(response.pastDue)
      }
    }

    if (!accountId) throw new InternalServerErrorException('Aucun id de compte de paiement')

    if (iban) {
      await this.paymentAPI.createAndAssignIBAN(accountId, iban, VmcCompaniesKeyNames.PLATEFORME)
      professional.professionalProfile.professionalPaymentData.setIban(iban)
    }

    if (birthday) {
      professional.birthday = birthday
    }

    if (identityDocumentRecto || identityDocumentVerso)
      await this.paymentAPI.verifyIdentityDocument(accountId, VmcCompaniesKeyNames.PLATEFORME, identityDocumentRecto, identityDocumentVerso)

    this.userRepository.updateAsIs(professional)
    return accountId
  }

  public async updateAndSavePaymentAccount(professional: ProfessionalUser, pastDue: string[]): Promise<void> {
    const accountId = professional.professionalProfile.professionalPaymentData?.accountId

    if (!accountId) throw new NotFoundException("l'account id du professionnel est introuvable")

    professional.professionalProfile.professionalPaymentData.setPastDue(pastDue)

    this.userRepository.updateAsIs(professional)
  }

  public async getCreditCardList(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames): Promise<ICreditCard[]> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)

    const creditCardList = this.paymentAPI.getCreditCardList(customerIds[vmcCompaniesKeyName], vmcCompaniesKeyName).getOrThrow()

    return creditCardList
  }

  public async getCard(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames, creditCardId: string): Promise<ICreditCard> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)

    const creditCard = this.paymentAPI.getCreditCard(customerIds[vmcCompaniesKeyName], creditCardId, vmcCompaniesKeyName).getOrThrow()

    return creditCard
  }

  public async debitCreditCard(
    user: User,
    vmcCompaniesKeyName: VmcCompaniesKeyNames,
    creditCardId: string,
    amountInEuros: number,
    documentData: TDocumentData,
    metadata: Record<string, string> = {}
  ): Promise<IPaymentResponse> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)

    const debitCardResponse = this.paymentAPI
      .debitCreditCard(customerIds[vmcCompaniesKeyName], creditCardId, amountInEuros, vmcCompaniesKeyName, documentData, metadata)
      .getOrThrow()

    return debitCardResponse
  }

  public async createPaymentIntent(
    user,
    vmcCompanyAccountName: VmcCompaniesKeyNames,
    amountInEuros: number,
    documentData: TDocumentData,
    metadata?: Record<string, string>
  ): Promise<IPaymentResponse> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)

    const paymentIntent = this.paymentAPI
      .createPaymentIntent({
        customerId: customerIds[vmcCompanyAccountName],
        amountInEuros,
        vmcCompanyAccountName,
        documentData,
        metadata,
        setupFutureUsage: 'on_session',
      })
      .getOrThrow()

    return paymentIntent
  }

  public async refundPayment(paymentIntentId: string, vmcCompaniesKeyName: VmcCompaniesKeyNames, amount?: number): Promise<IRefundResponse> {
    const debitCardResponse = this.paymentAPI.refundPayment(paymentIntentId, vmcCompaniesKeyName, amount).getOrThrow()

    return debitCardResponse
  }

  public async deleteCreditCard(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames, creditCardId: string): Promise<boolean> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)
    const hasBeenDeleted = this.paymentAPI.deleteCreditCard(customerIds[vmcCompaniesKeyName], creditCardId, vmcCompaniesKeyName).getOrThrow()
    return hasBeenDeleted
  }

  public async createCardSetup(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames): Promise<TDebitCardIntentClientSecret> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)
    const clientSecret = this.paymentAPI.getNewCreditCardCreationKey(customerIds[vmcCompaniesKeyName], vmcCompaniesKeyName).getOrThrow()

    return clientSecret
  }

  public async getDefaultCreditCard(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames): Promise<ICreditCard | null> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)
    const creditCard = this.paymentAPI.getDefaultCreditCard(customerIds[vmcCompaniesKeyName], vmcCompaniesKeyName).getOrNull()

    return creditCard
  }

  public async setDefaultCreditCard(user: User, vmcCompaniesKeyName: VmcCompaniesKeyNames, creditCardId: string): Promise<boolean> {
    const customerIds = await this.getOrCreateAndSaveCustomerIds(user)
    const success = this.paymentAPI.setDefaultCreditCard(customerIds[vmcCompaniesKeyName], creditCardId, vmcCompaniesKeyName).getOrThrow()

    return success
  }

  public async payProfessionalForMissionCompletion(professional: ProfessionalUser, mission: Mission): Promise<string> {
    const accountId = professional.professionalProfile.professionalPaymentData.accountId
    if (!accountId) throw new ForbiddenException("Le spécialiste n'a pas renseigné ses modalités de virement")

    const quote = mission.getActiveProfessionalEntry(professional._id.toString()).proposal?.quote
    if (!quote) throw new ForbiddenException('Devis manquant pour le paiement du spécialiste')

    const amountInEuros = quote.totalTTCToProfessional

    const transferId = await this.paymentAPI.transferFundsToCustomerAccount(
      mission._id.toString(),
      accountId,
      amountInEuros,
      VmcCompaniesKeyNames.PLATEFORME
    )

    return transferId
  }
}
