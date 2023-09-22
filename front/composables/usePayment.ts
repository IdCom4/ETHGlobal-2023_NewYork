import { PaymentMethod, Stripe, StripeElements, StripePaymentElement, loadStripe } from '@stripe/stripe-js'
import { EStripePublicKeyEnv } from '@/types/external_APIs/payment-provider.enum'

export const usePayment = (): IPaymentProviderAPI => {
  return {
    /**
     * get all the credit cards registred by the user
     *
     * @param {IAlertControl}                      alert           An object that allows control over request feedback display
     *
     * @returns an IRequestResult with the card list of the user
     */
    getPaymentMethods: async (alert?: IAlertControl) => {
      const paymentMethods = await useAPI().payment.getPaymentMethods(alert)

      if (!paymentMethods.data) {
        useAlertStore().handleRequestResult(alert, paymentMethods.error)
        return { data: null, error: paymentMethods.error }
      }

      const convertedArray = []
      for (const paymentMethod of paymentMethods.data) {
        const card = paymentMethod
        if (!card) continue
        convertedArray.push(card)
      }

      return {
        data: convertedArray,
        error: null
      }
    },

    /**
     * get the credit card associtated with the id
     *
     * @param {string}          paymentMethodId  the id of the paymentMethod of the customer from Stripe
     * @param {IAlertControl}   alert            An object that allows control over request feedback display
     *
     * @returns an IRequestResult with the card fetched card
     */
    getPaymentMethod: async (paymentMethodId: string, alert?: IAlertControl) => {
      const paymentMethod = await useAPI().payment.getPaymentMethod(paymentMethodId, alert)
      if (!paymentMethod.data) {
        useAlertStore().handleRequestResult(alert, paymentMethod.error)
        return { data: null, error: paymentMethod.error }
      }

      useAlertStore().handleRequestResult(alert)
      return { data: paymentMethod.data, error: null }
    },
    /**
     * delete the credit card associtated with the id
     *
     * @param {string}          paymentMethodId  the id of the paymentMethod to delete
     * @param {IAlertControl}   alert            An object that allows control over request feedback display
     *
     * @returns an IRequestResult with a boolean to tell if the deletetion has been successfull
     */
    deletePaymentMethod: async (paymentMethodId: string, alert?: IAlertControl) => {
      const deleteRes = await useAPI().payment.detachPaymentMethod(paymentMethodId, alert)
      if (!deleteRes.data) {
        useAlertStore().handleRequestResult(alert, deleteRes.error)
        return { data: null, error: deleteRes.error }
      }
      useAlertStore().handleRequestResult(alert)
      return { data: true, error: null }
    },

    /**
     * get the default credit card of the customer
     *
     * @param {IAlertControl}   alert An object that allows control over request feedback display
     *
     * @returns an IRequestResult with the default credit card of the customer
     */
    getDefaultPaymentMethod: async (alert?: IAlertControl) => {
      const defaultPaymentMethod = await useAPI().payment.getDefaultPaymentMethod(alert)
      if (!defaultPaymentMethod.data) {
        useAlertStore().handleRequestResult(alert, defaultPaymentMethod.error)
        return { data: null, error: defaultPaymentMethod.error }
      }

      useAlertStore().handleRequestResult(alert)
      return { data: defaultPaymentMethod.data, error: null }
    },

    /**
     * set a credit card as default payment method
     *
     * @param {string}          paymentMethodId  the id of the paymentMethod to set to default
     * @param {IAlertControl}   alert An object that allows control over request feedback display
     *
     * @returns an IRequestResult with a boolean to tell if update has been successfull
     */
    updateDefaultPaymentMethod: async (paymentMethodId: string, alert?: IAlertControl) => {
      const updateRes = await useAPI().payment.updateDefaultPaymentMethod(paymentMethodId, alert)
      if (!updateRes.data) {
        useAlertStore().handleRequestResult(alert, updateRes.error)
        return { data: null, error: updateRes.error }
      }

      useAlertStore().handleRequestResult(alert)
      return { data: true, error: null }
    },

    /**
     * mount the card input interface on a HTMLElement for adding a card
     *
     * @param {string}          elementWrapper  The HTML element to mount the interface on
     *
     * @returns a function to submit and validate the informations of the credit card
     */
    mountSetupInput: async (elementWrapper: HTMLElement): Promise<TSetupSubmitFunction> => {
      const stripeJs = await StripeHelper.getStripeJs()
      const elements: StripeElements | undefined = stripeJs.elements({
        mode: 'setup',
        currency: 'eur',
        payment_method_types: ['card']
      })
      const paymentElement: StripePaymentElement | undefined = elements.create('payment')
      paymentElement.mount(elementWrapper)

      //This function need to be called to validate and submit card informations
      return StripeHelper.getSetupSubmitFunction(elements, stripeJs)
    },

    mountPaymentInput: async (elementWrapper: HTMLElement, amount: number): Promise<TPaymentSubmitFunction> => {
      const stripeJs = await StripeHelper.getStripeJs()
      const elements: StripeElements = stripeJs.elements({
        mode: 'payment',
        currency: 'eur',
        payment_method_types: ['card'],
        amount: amount * 100,
        setup_future_usage: 'on_session'
      })
      const paymentElement: StripePaymentElement = elements.create('payment')
      paymentElement.mount(elementWrapper)

      //This function need to be called to validate and submit card informations
      return StripeHelper.getPaymentSubmitFunction(elements, stripeJs)
    },

    confirmPayment: async (paymentClientSecret: string, paymentMethodId: string, alert?: IAlertControl) => {
      const stripeJs = await StripeHelper.getStripeJs()

      const { error } = await stripeJs.confirmCardPayment(paymentClientSecret, {
        payment_method: paymentMethodId
      })

      if (error && error.message) {
        const errorResult: IRequestError = { status: 400, message: error.message }
        useAlertStore().handleRequestResult(alert, errorResult)
        return { data: null, error: errorResult }
      }

      return { data: true, error: null }
    },

    /* ==== LEGACY CODE => KEPT FOR DOCUMENTATION PURPOSES ==== */
    /* createBankAccountToken: async (iban: string, alert?: IAlertControl) => {
      const stripeJs = await StripeHelper.getStripeJs(EStripePublicKeyEnv.PLATFORM)

      // stripe's typecript typing is outdated, this usage is correct
      // @ts-ignore
      const { token, error } = await stripeJs.createToken('bank_account', {
        country: 'FR',
        currency: 'eur',
        account_number: iban
      })

      if (error && error.message) {
        const errorResult: IRequestError = { status: 400, message: error.message }
        useAlertStore().handleRequestResult(alert, errorResult)
        return { data: null, error: errorResult }
      }

      if (token) return { data: token.id, error: null }

      return { data: null, error: { status: 400, message: 'Une erreur est survenue' } }
    }, */

    createAccountToken: async (personalInformations: IPersonalInfoPayload, alert?: IAlertControl) => {
      const stripeJs = await StripeHelper.getStripeJs(EStripePublicKeyEnv.PLATFORM)

      const dateOfBirth =
        personalInformations.dateOfBirth?.day && personalInformations.dateOfBirth?.month && personalInformations.dateOfBirth?.year
          ? {
              day: personalInformations.dateOfBirth.day,
              month: personalInformations.dateOfBirth.month,
              year: personalInformations.dateOfBirth.year
            }
          : undefined

      const stripeAddress = personalInformations.address
        ? {
            city: personalInformations.address.city,
            country: 'FR',
            line1: personalInformations.address.street,
            postal_code: personalInformations.address.zipCode,
            state: personalInformations.address.zipCode.substring(0, 2)
          }
        : undefined

      if (personalInformations.phone && personalInformations.phone?.startsWith('0'))
        personalInformations.phone = '+33'.concat(personalInformations.phone.slice(1))

      const { error, token } = await stripeJs.createToken('account', {
        individual: {
          first_name: personalInformations.name,
          last_name: personalInformations.lastName,
          phone: personalInformations.phone,
          email: personalInformations.email,
          address: stripeAddress,
          dob: dateOfBirth
        },
        business_type: 'individual',
        tos_shown_and_accepted: true
      })

      if (error && error.message) {
        const errorResult: IRequestError = { status: 400, message: error.message }
        useAlertStore().handleRequestResult(alert, errorResult)
        return { data: null, error: errorResult }
      }

      if (token) return { data: token.id, error: null }

      return { data: null, error: { status: 400, message: 'Une erreur est survenue' } }
    },

    uploadIdCard: async (idCardFile: File, alert?: IAlertControl) => {
      const formData = new FormData()
      formData.append('file', idCardFile)
      formData.append('purpose', 'identity_document')

      try {
        const fileResult = await fetch('https://uploads.stripe.com/v1/files', {
          method: 'POST',
          headers: { Authorization: `Bearer ${useConfig().get(EStripePublicKeyEnv.PLATFORM)}` },
          body: formData
        })

        const fileData = await fileResult.json()
        return { data: fileData.id as string, error: null }
      } catch (err) {
        useAlertStore().handleRequestResult(alert, { message: err as string, status: 400 })

        return { data: null, error: { message: err as string, status: 400 } }
      }

      // TODO: replace above implementation with this one
      // ! Arnaud said that he couldn't make the following code work
      // ! but this code is better as it's smaller and uses our APIs
      /* const response = await useRequest().post<{ id: string }>('https://uploads.stripe.com/v1/files', {
        headers: { Authorization: `Bearer ${useConfig().get(EStripePublicKeyEnv.PLATFORM)}` },
        body: formData
      })

      if (!response.data || response.error) {
        useAlertStore().handleRequestResult(alert, response.error)
        return { data: null, error: response.error }
      }

      // null check is done right above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return { data: response.data!.id, error: response.error } */
    }
  }
}

export class StripeHelper {
  public static stripeJs: Stripe | null = null

  public static stripePaymentMethodToCard(paymentMethod: PaymentMethod): ICreditCard | null {
    const creditCardStripe = paymentMethod.card
    if (!creditCardStripe) return null

    return {
      id: paymentMethod.id,
      brand: creditCardStripe.brand,
      country: creditCardStripe.country,
      expMonth: creditCardStripe.exp_month,
      expYear: creditCardStripe.exp_year,
      fingerprint: creditCardStripe.fingerprint,
      funding: creditCardStripe.funding,
      last4: creditCardStripe.last4,
      threeDSecureSupported: creditCardStripe.three_d_secure_usage?.supported || null
    }
  }

  public static getStripeJs = async (companyProfile?: EStripePublicKeyEnv) => {
    const isCenterProfile = useRoute().path.includes('centres')

    const stripePublicKey = companyProfile
      ? useConfig().get(companyProfile)
      : isCenterProfile
      ? useConfig().get(EStripePublicKeyEnv.CENTER)
      : useConfig().get(EStripePublicKeyEnv.PLATFORM)

    if (!StripeHelper.stripeJs) StripeHelper.stripeJs = await loadStripe(stripePublicKey)
    if (!StripeHelper.stripeJs) throw new Error('StripeJs failed to load')
    return StripeHelper.stripeJs
  }

  public static getPaymentSubmitFunction(elements: StripeElements, stripeJs: Stripe) {
    return async (clientSecret: string, alert?: IAlertControl) => {
      // Check if card informations are filled properly
      const { error: submitError } = await elements.submit()
      if (submitError) {
        const errorObj: IRequestError = { status: 400, message: submitError.message || 'Une erreur est survenue' }

        useAlertStore().handleRequestResult(alert, errorObj)
        return { data: null, error: errorObj }
      }

      const confirmResult = await stripeJs.confirmPayment({
        elements: elements,
        clientSecret: clientSecret || '',
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.href
        }
      })

      if (confirmResult.error) {
        const errorObj: IRequestError = { status: 400, message: confirmResult.error.message || 'Erreur lors de la confirmation de la carte' }
        useAlertStore().handleRequestResult(alert, errorObj)
        return {
          data: null,
          error: errorObj
        }
      }

      useAlertStore().handleRequestResult(alert)

      return {
        data: true,
        error: null
      }
    }
  }

  public static getSetupSubmitFunction = (elements: StripeElements, stripeJs: Stripe) => {
    return async (alert?: IAlertControl) => {
      // Check if card informations are filled properly
      const { error: submitError } = await elements.submit()
      if (submitError) {
        const errorObj: IRequestError = { status: 400, message: submitError.message || 'Une erreur est survenue' }

        useAlertStore().handleRequestResult(alert, errorObj)
        return { data: null, error: errorObj }
      }

      // Create a "SetupIntent" in Stripe API
      const setupRes = await useAPI().payment.createSetup()
      if (setupRes.error) {
        useAlertStore().handleRequestResult(alert, setupRes.error)
        return { data: null, error: setupRes.error }
      }

      // Instantly confirm setup created with the card informations submited
      const client_secret = setupRes.data

      const confirmResult = await stripeJs.confirmSetup({
        elements: elements,
        clientSecret: client_secret || '',
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.href
        }
      })

      if (confirmResult.error) {
        const errorObj: IRequestError = { status: 400, message: confirmResult.error.message || 'Erreur lors de la confirmation de la carte' }
        useAlertStore().handleRequestResult(alert, errorObj)
        return {
          data: null,
          error: errorObj
        }
      }

      const paymentMethodId = confirmResult.setupIntent.payment_method as string

      // The card has been created but we haven't its data yet, so we fetch it
      const creditCardResult = await useAPI().payment.getPaymentMethod(paymentMethodId)
      if (creditCardResult.error) {
        useAlertStore().handleRequestResult(alert, creditCardResult.error)
        return { data: null, error: creditCardResult.error }
      }

      if (!creditCardResult.data) {
        const errorObj: IRequestError = { status: 404, message: 'carte non trouvée' }
        useAlertStore().handleRequestResult(alert, errorObj)
        return { data: null, error: errorObj }
      }

      useAlertStore().handleRequestResult(alert)

      return {
        data: creditCardResult.data,
        error: null
      }
    }
  }
}
