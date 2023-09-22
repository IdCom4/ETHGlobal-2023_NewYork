export {}

declare global {
  type TBase64File = string
  type TFileName = string

  type TFile = { content: TBase64File; name?: TFileName }
}
