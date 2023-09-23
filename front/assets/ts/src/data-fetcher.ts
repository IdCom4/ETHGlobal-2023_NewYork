export class DataFetcher {
  public static async fetchAppTransactions(appAddress: string): Promise<ITransaction[]> {
    // graph query

    return [
      { appAddress: 'app1', assetId: 'asset1-1', contributorAddress: 'contributor1-1', entry: 'entry1-1' },
      { appAddress: 'app1', assetId: 'asset1-1', contributorAddress: 'contributor1-2', entry: 'entry1-1' },
      { appAddress: 'app1', assetId: 'asset1-1', contributorAddress: 'contributor1-3', entry: 'entry1-3' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-1', entry: 'entry1-1' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-2', entry: 'entry1-2' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-3', entry: 'entry1-3' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-4', entry: 'entry1-3' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-5', entry: 'entry1-2' },
      { appAddress: 'app1', assetId: 'asset2-1', contributorAddress: 'contributor1-8', entry: 'entry1-3' },
      { appAddress: 'app1', assetId: 'asset1-4', contributorAddress: 'contributor1-4', entry: 'entry1-4' },
      { appAddress: 'app1', assetId: 'asset1-5', contributorAddress: 'contributor1-5', entry: 'entry1-5' },
      { appAddress: 'app1', assetId: 'asset1-6', contributorAddress: 'contributor1-6', entry: 'entry1-6' },
      { appAddress: 'app1', assetId: 'asset1-7', contributorAddress: 'contributor1-7', entry: 'entry1-7' }
    ]
  }

  public static async fetchAssetTransactions(assetId: string): Promise<ITransaction[]> {
    // graph query

    return [{ appAddress: 'app2', assetId: 'asset2', contributorAddress: 'contributor2', entry: 'entry2' }]
  }

  public static async fetchContributorTransactions(contributorAddress: string): Promise<ITransaction[]> {
    // graph query

    return [{ appAddress: 'app3', assetId: 'asset3', contributorAddress: 'contributor3', entry: 'entry3' }]
  }

  public static async fetchAppAssetsTransactionsWhereContributorContributed(contributorAddress: string, appAddress: string): Promise<ITransaction[]> {
    // graph query

    return [{ appAddress: 'app4', assetId: 'asset4', contributorAddress: 'contributor4', entry: 'entry4' }]
  }

  public static async fetchContributorAppTransations(contributorAddress: string, appAddress: string): Promise<ITransaction[]> {
    // graph query

    return [{ appAddress: 'app5-1', assetId: 'asset5-1', contributorAddress: 'contributor5-1', entry: 'entry5-1' }]
  }
}
