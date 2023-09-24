export class DataFetcher {
  public static async fetchAppTransactions(appAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, error } = await useRequest().post<{ data: { contributes: ITransaction[] } }>(
      'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.2',
      {
        body: {
          query:
            'query MyQuery ($appAddress: String) { contributes (where: {appAddress: $appAddress}) { assetId userInput appAddress userAddress } }',
          operationName: 'MyQuery',
          variables: { appAddress }
        }
      }
    )

    if (!data || error) return []

    return data.data?.contributes || []
  }

  public static async fetchAssetTransactions(assetId: string): Promise<ITransaction[]> {
    // graph query
    const { data, error } = await useRequest().post<{ data: { contributes: ITransaction[] } }>(
      'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.2',
      {
        body: {
          query: 'query MyQuery ($assetId: String) { contributes (where: {assetId: $assetId}) { assetId userInput assetId userAddress } }',
          operationName: 'MyQuery',
          variables: { assetId }
        }
      }
    )

    if (!data || error) return []

    return data.data?.contributes || []
  }

  public static async fetchContributorTransactions(userAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, error } = await useRequest().post<{ data: { contributes: ITransaction[] } }>(
      'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.2',
      {
        body: {
          query:
            'query MyQuery ($userAddress: String) { contributes (where: {userAddress: $userAddress}) { assetId userInput userAddress userAddress } }',
          operationName: 'MyQuery',
          variables: { userAddress }
        }
      }
    )

    if (!data || error) return []

    return data.data?.contributes || []
  }

  public static async fetchContributorAppTransactions(userAddress: string, appAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, error } = await useRequest().post<{ data: { contributes: ITransaction[] } }>(
      'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.2',
      {
        body: {
          query:
            'query MyQuery ($appAddress: String, $userAddress) { contributes (where: {appAddress: $appAddress, and: {userAddress: $userAddress}}) { assetId userInput appAddress userAddress } }',
          operationName: 'MyQuery',
          variables: { appAddress, userAddress }
        }
      }
    )

    if (!data || error) return []

    return data.data?.contributes || []
  }
}
