import { DataFetcher } from './data-fetcher'
import { DataProcesser } from './data-processer'

export class Wisdom {
  //inputUser
  //appId
  //fileId
  public generateContributionKey(userInput: string, assetId: string): string {
    //return the user signature
    return ''
  }

  public static async fetchAssetContributions(assetId: string): Promise<Record<TContributorEntry, TProportion>> {
    // fetch data
    const assetTransactions = await DataFetcher.fetchAssetTransactions(assetId)

    return DataProcesser.getAssetContributionsFromAssetTransactions(assetTransactions)
  }

  public static async fetchAppContributions(appAddress: string): Promise<Record<TAssetId, Record<TContributorEntry, TProportion>>> {
    // fetch data
    const appTransactions = await DataFetcher.fetchAppTransactions(appAddress)

    // filter assets transactions
    const appAssetsTransactions = DataProcesser.regroupAssetsTransactionsFromAllTransactions(appTransactions)

    // get assets contributions
    const appAssetsContributions: Record<TAssetId, Record<TContributorEntry, TProportion>> = {}
    for (const [assetId, transactions] of Object.entries(appAssetsTransactions))
      appAssetsContributions[assetId] = DataProcesser.getAssetContributionsFromAssetTransactions(transactions)

    return appAssetsContributions
  }

  public static async fetchContributorContributions(contributorAddress: string): Promise<Record<TAssetId, TContributorEntry>[]> {
    // fetch data
    const contributorAllTransactions = await DataFetcher.fetchContributorTransactions(contributorAddress)

    return DataProcesser.getContributorContributionsFromTransactions(contributorAllTransactions)
  }

  public static async fetchContributorAppContributions(
    contributorAddress: string,
    appAddress: string
  ): Promise<Record<TAssetId, TContributorEntry>[]> {
    // fetch data
    const contributorAppTransactions = await DataFetcher.fetchContributorAppTransactions(contributorAddress, appAddress)

    return DataProcesser.getContributorContributionsFromTransactions(contributorAppTransactions)
  }

  public static async fetchContributorAppReputation(contributorAddress: string, appAddress: string): Promise<TContributorReputation> {
    // fetch data
    const appAssetsTransactions = await DataFetcher.fetchAppTransactions(appAddress)

    return DataProcesser.getContributorReputationFromAssetsTransactionsWhereContributorContributed(contributorAddress, appAssetsTransactions)
  }

  public static async fetchAppContributorsReputation(appAddress: string): Promise<Record<TContributorAddress, TContributorReputation>> {
    // fetch data
    const appTransactions = await DataFetcher.fetchAppTransactions(appAddress)

    return DataProcesser.getAppAllContributorReputations(appTransactions)
  }
}
