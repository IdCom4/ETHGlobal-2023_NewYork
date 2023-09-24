import axios from "axios"

export class DataFetcher {
  public static async fetchAppTransactions(appAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, status } = await axios<{ data: { contributes: ITransaction[] } }>({ 'baseURL': 'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.3', 'method': 'POST', 'data': {
          query:
            'query MyQuery ($appAddress: String) { contributes (where: {appAddress: $appAddress}) { assetId userInput appAddress userAddress } }',
          operationName: 'MyQuery',
          variables: { appAddress }
        }
      }
    )

    if (!data || status !== 200) return []

    return data.data?.contributes || []
  }

  public static async fetchAssetTransactions(assetId: string): Promise<ITransaction[]> {
    // graph query
    const { data, status } = await axios<{ data: { contributes: ITransaction[] } }>({ 'baseURL': 'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.3', 'method': 'POST', 'data': {
          query: 'query MyQuery ($assetId: String) { contributes (where: {assetId: $assetId}) { assetId userInput assetId userAddress } }',
          operationName: 'MyQuery',
          variables: { assetId }
        }
      }
    )

    if (!data || status !== 200) return []

    return data.data?.contributes || []
  }

  public static async fetchContributorTransactions(userAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, status } = await axios<{ data: { contributes: ITransaction[] } }>({ 'baseURL': 'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.3', 'method': 'POST', 'data': {
          query:
            'query MyQuery ($userAddress: String) { contributes (where: {userAddress: $userAddress}) { assetId userInput userAddress userAddress } }',
          operationName: 'MyQuery',
          variables: { userAddress }
        }
      }
    )

    if (!data || status !== 200) return []

    return data.data?.contributes || []
  }

  public static async fetchContributorAppTransactions(userAddress: string, appAddress: string): Promise<ITransaction[]> {
    // graph query
    const { data, status } = await axios<{ data: { contributes: ITransaction[] } }>({ 'baseURL': 'https://api.studio.thegraph.com/query/53565/wisdom/v0.0.3', 'method': 'POST', 'data': {
      query:
        'query MyQuery ($appAddress: String, $userAddress) { contributes (where: {appAddress: $appAddress, and: {userAddress: $userAddress}}) { assetId userInput appAddress userAddress } }',
      operationName: 'MyQuery',
      variables: { appAddress, userAddress }
    }})

    if (!data || status !== 200) return []

    return data.data?.contributes || []
  }
}
