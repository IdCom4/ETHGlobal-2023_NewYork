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
        contributorAddress: string
        assetId: string
        entry: string
    }
}