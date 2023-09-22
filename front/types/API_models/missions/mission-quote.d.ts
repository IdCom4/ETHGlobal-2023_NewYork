export {}

declare global {
  //####### Front Only ###########
  interface IDateAndAddress {
    date?: Date
    address?: IStrictAddress
  }

  type TQuoteItemErrorMessages = Record<keyof IMissionQuoteProduct, string>
  type TQuoteItemLabels = Record<keyof IMissionQuoteProduct, string>
}
