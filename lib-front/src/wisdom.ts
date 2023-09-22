export class Wisdom 
{

    //inputUser
    //appId
    //fileId
    public generateContributionKey(userInput: string, assetId: string): string //return the user signature
    {

        return ''
    }

    public fetchAssetContributions(assetId: string): Record<TContributorEntry, TProportion> {}

    public fetchAppContributions(appAddress: string): Record<TContributorEntry, TProportion>[] {}

    public fetchContributorContributions(contributorAddress: string): Record<TAssetId, TContributorEntry>[] {}
    
    public fetchContributorAppContributions(contributorAddress: string, appAddress: string): Record<TAssetId, TContributorEntry>[] {}

    public fetchContributorAppReputation(appAddress: string, contributorAddress: string): TContributorReputation {}

    public fetchAppContributorsReputation(appAddress: string): Record<TContributorAddress, TContributorReputation> {}


}