import { DataFetcher } from "./data-fetcher"
import { DataProcesser } from "./data-processer"
import '@/extensions'

export class Wisdom 
{

    //inputUser
    //appId
    //fileId
    public generateContributionKey(userInput: string, assetId: string): string //return the user signature
    {

        return ''
    }

    public async fetchAssetContributions(assetId: string): Promise<Record<TContributorEntry, TProportion>> {
        // fetch data
        const assetTransactions = await DataFetcher.fetchAssetTransactions(assetId)

        
        return DataProcesser.getAssetContributionsFromAssetTransations(assetTransactions)
    }

    public async fetchAppContributions(appAddress: string): Promise<Record<TAssetId, Record<TContributorEntry, TProportion>>> {
        // fetch data
        const appTransactions = await DataFetcher.fetchAppTransactions(appAddress)

        // filter assets transactions
        const appAssetsTransactions = DataProcesser.regroupAssetsTransactionsFromAllTransactions(appTransactions)

        // get assets contributions
        const appAssetsContributions: Record<TAssetId, Record<TContributorEntry, TProportion>> = {}
        for (const [assetId, transactions] of Object.entries(appAssetsTransactions))
            appAssetsContributions[assetId] = DataProcesser.getAssetContributionsFromAssetTransations(transactions)
            
        return appAssetsContributions
    }

    public async fetchContributorContributions(contributorAddress: string): Promise<Record<TAssetId, TContributorEntry>[]> {
        // fetch data
        const contributorAllTransactions = await DataFetcher.fetchContributorTransactions(contributorAddress)

        return DataProcesser.getContributorContributionsFromTransactions(contributorAllTransactions)

    }
    
    public async fetchContributorAppContributions(contributorAddress: string, appAddress: string): Promise<Record<TAssetId, TContributorEntry>[]> {
        // fetch data
        const contributorAppTransactions = await DataFetcher.fetchContributorAppTransations(contributorAddress, appAddress)

        return DataProcesser.getContributorContributionsFromTransactions(contributorAppTransactions)
    }

    public async fetchContributorAppReputation(appAddress: string, contributorAddress: string): Promise<TContributorReputation> {
        // fetch data
        const appAssetsTransactions = await DataFetcher.fetchAppAssetsTransactionsWhereContributorContributed(contributorAddress, appAddress)

        return DataProcesser.getContributorReputationFromAssetsTransactionsWhereContributorContributed(contributorAddress, appAssetsTransactions)
    }

    public async fetchAppContributorsReputation(appAddress: string): Promise<Record<TContributorAddress, TContributorReputation>> {
        // fetch data
        const appTransactions = await DataFetcher.fetchAppTransactions(appAddress)

        return DataProcesser.getAppAllContributorReputations(appTransactions)
    }


}