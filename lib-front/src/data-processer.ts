export class DataProcesser {

  public static getAppAssetsIdsFromTransactions(appTransactions: ITransaction[]): string[] {
    return appTransactions.map((transaction: ITransaction) => transaction.assetId).removeDuplicates()
  }

  public static getAssetContributionsFromAssetTransations(assetTransactions: ITransaction[]): Record<TContributorEntry, TProportion> {
    // get each entry's amount
    const assetEntriesAmount: Record<TContributorEntry, number> = {}
    for (const transaction of assetTransactions) {
        if (assetEntriesAmount[transaction.entry]) assetEntriesAmount[transaction.entry] += 1
        else assetEntriesAmount[transaction.entry] = 1
    }

    // get proportions
    const totalAmount = assetTransactions.length
    const assetEntriesProportion: Record<TContributorEntry, TProportion> = {}
    for (const [entry, amount] of Object.entries(assetEntriesAmount))
        assetEntriesProportion[entry] = amount / totalAmount * 100

    return assetEntriesProportion
  }

  public static regroupAssetsTransactionsFromAllTransactions(allTransactions: ITransaction[]): Record<TAssetId, ITransaction[]> {
    // get all assetsId
    const assetsIds = DataProcesser.getAppAssetsIdsFromTransactions(allTransactions)

    // filter transactions by assetId
    const appAssetsTransactions: Record<TAssetId, ITransaction[]> = {}
    for (const assetId of assetsIds)
      appAssetsTransactions[assetId] = allTransactions.filter((transaction: ITransaction) => transaction.assetId === assetId)

    return appAssetsTransactions
  }

  public static getContributorContributionsFromTransactions(transactions: ITransaction[]): Record<TAssetId, TContributorEntry>[] {
    return transactions.map((transaction: ITransaction) => ({ [transaction.assetId]: transaction.entry }))
  }

  public static getContributorReputationFromAssetsTransactionsWhereContributorContributed(contributorAddress: string, appTransactions: ITransaction[]): TContributorReputation {

    // regroup transactions
    const assetsTransactions = DataProcesser.regroupAssetsTransactionsFromAllTransactions(appTransactions) 

    const contributorAssetScores: number[] = []
    for (const transactions of Object.values(assetsTransactions)) {
      const assetScore = DataProcesser.getContributionScoreFromAssetTransactions(transactions, contributorAddress)
      if (assetScore) contributorAssetScores.push(assetScore)
    }

    if (contributorAssetScores.length) return 0

    
    // add every scores and multiply by the amount of contribution to enforce contributions amount impact
    return contributorAssetScores.reduce((prev, current) => prev + current) * (1 / contributorAssetScores.length)  
  }
  
  public static getContributionScoreFromAssetTransactions(assetTransactions: ITransaction[], contributorAddress: string): number {
    // start reputation computation at contributor's entry
    const entryIndex = assetTransactions.findIndex((transaction: ITransaction) => transaction.contributorAddress === contributorAddress)

    if (entryIndex < 0) return 0

    const contributorEntry = assetTransactions[entryIndex].entry
    let contributorScore = 0

    // compare contributor entry to the later contributor's
    for (let index = entryIndex + 1; entryIndex < assetTransactions.length; index++)
      contributorScore += assetTransactions[index].entry === contributorEntry ? 1 : -1

    return contributorScore
  }

  public static getAppAllContributorReputations(appTransactions: ITransaction[]): Record<TContributorAddress, TContributorReputation> {
    // regroup transactions
    const assetsTransactions = DataProcesser.regroupAssetsTransactionsFromAllTransactions(appTransactions)
    // get all contributors
    const contributorsAddresses = appTransactions.map((transaction: ITransaction) => transaction.contributorAddress).removeDuplicates() 

    const contributorsReputation: Record<TContributorAddress, TContributorReputation> = {}
    // for each contributor
    for (const contributorAddress of contributorsAddresses) {
      // get its reputation
      for (const transactions of Object.values(assetsTransactions)) {
        if (transactions.some((transaction: ITransaction) => transaction.contributorAddress === contributorAddress))
          contributorsReputation[contributorAddress] = DataProcesser.getContributorReputationFromAssetsTransactionsWhereContributorContributed(contributorAddress, transactions)
      }
    }

    return contributorsReputation
  }

}