import { PaymentMethod } from '@stripe/stripe-js'

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1N3cYTCN7b44IDnX2jSNBNOU',
    object: 'payment_method',
    billing_details: {
      address: {
        city: null,
        country: 'FR',
        line1: null,
        line2: null,
        postal_code: null,
        state: null
      },
      email: null,
      name: null,
      phone: null
    },
    card: {
      brand: 'mastercard',
      checks: {
        address_line1_check: null,
        address_postal_code_check: null,
        cvc_check: 'pass'
      },
      country: 'AU',
      exp_month: 12,
      exp_year: 2045,
      fingerprint: 'N6NtfGLQdTdrUq0B',
      funding: 'debit',
      last4: '0080',
      three_d_secure_usage: {
        supported: true
      },
      wallet: null
    },
    created: 1683108301,
    customer: 'cus_MzIDaBWa7M1vfX',
    livemode: false,
    metadata: {},
    type: 'card'
  },
  {
    id: 'pm_1N3JThCN7b44IDnXVKLSoo6F',
    object: 'payment_method',
    billing_details: {
      address: {
        city: null,
        country: 'FR',
        line1: null,
        line2: null,
        postal_code: null,
        state: null
      },
      email: null,
      name: null,
      phone: null
    },
    card: {
      brand: 'mastercard',
      checks: {
        address_line1_check: null,
        address_postal_code_check: null,
        cvc_check: 'pass'
      },
      country: 'AE',
      exp_month: 12,
      exp_year: 2032,
      fingerprint: 'RSseAQgJUCyylpDb',
      funding: 'debit',
      last4: '0022',
      three_d_secure_usage: {
        supported: true
      },
      wallet: null
    },
    created: 1683034969,
    customer: 'cus_MzIDaBWa7M1vfX',
    livemode: false,
    metadata: {},
    type: 'card'
  },
  {
    id: 'pm_1MuCzbCN7b44IDnXvjUFKoZE',
    object: 'payment_method',
    billing_details: {
      address: {
        city: null,
        country: 'FR',
        line1: null,
        line2: null,
        postal_code: null,
        state: null
      },
      email: null,
      name: null,
      phone: null
    },
    card: {
      brand: 'mastercard',
      checks: {
        address_line1_check: null,
        address_postal_code_check: null,
        cvc_check: 'pass'
      },
      country: 'US',
      exp_month: 4,
      exp_year: 2054,
      fingerprint: '4XEN70jAzxR2q4TF',
      funding: 'credit',
      last4: '4444',
      three_d_secure_usage: {
        supported: true
      },
      wallet: null
    },
    created: 1680865087,
    customer: 'cus_MzIDaBWa7M1vfX',
    livemode: false,
    metadata: {},
    type: 'card'
  },
  {
    id: 'pm_1MFJcbCN7b44IDnX6z8dhUqO',
    object: 'payment_method',
    billing_details: {
      address: {
        city: null,
        country: null,
        line1: null,
        line2: null,
        postal_code: '42424',
        state: null
      },
      email: null,
      name: 'Philippe Sim',
      phone: null
    },
    card: {
      brand: 'visa',
      checks: {
        address_line1_check: null,
        address_postal_code_check: 'pass',
        cvc_check: 'pass'
      },
      country: 'US',
      exp_month: 4,
      exp_year: 2024,
      fingerprint: 'aJNU9Mlx38CWX7RR',
      funding: 'credit',
      last4: '4242',
      three_d_secure_usage: {
        supported: true
      },
      wallet: null
    },
    created: 1671119121,
    customer: 'cus_MzIDaBWa7M1vfX',
    livemode: false,
    metadata: {},
    type: 'card'
  }
]

export const paymentMethod: PaymentMethod = {
  id: 'pm_1N3ytHCN7b44IDnX6ptsXgCU',
  object: 'payment_method',
  billing_details: {
    address: {
      city: null,
      country: 'FR',
      line1: null,
      line2: null,
      postal_code: null,
      state: null
    },
    email: null,
    name: null,
    phone: null
  },
  card: {
    brand: 'visa',
    checks: {
      address_line1_check: null,
      address_postal_code_check: null,
      cvc_check: 'pass'
    },
    country: 'HK',
    exp_month: 12,
    exp_year: 2034,
    fingerprint: 'l5tlyMFOZ2ZQ63BX',
    funding: 'credit',
    last4: '0004',
    three_d_secure_usage: {
      supported: true
    },
    wallet: null
  },
  created: 1683194159,
  customer: 'cus_MzIDaBWa7M1vfX',
  livemode: false,
  metadata: {},
  type: 'card'
}
