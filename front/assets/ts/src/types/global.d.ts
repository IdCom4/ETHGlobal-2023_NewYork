export {}

declare global {
  type TContributorAddress = string
  type TAppAddress = string
  type TAssetId = string
  type TContributorEntry = string
  type TProportion = number
  type TContributorReputation = number

  interface ITransaction {
    appAddress: string
    userAddress: string
    assetId: string
    userInput: string
  }
}
