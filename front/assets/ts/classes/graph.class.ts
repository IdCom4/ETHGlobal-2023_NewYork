export interface IGraphData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
  }>
}

export class GraphHelper {
  public static fromAssetContributions(datas: Record<TContributorEntry, TProportion>): IGraphData {
    return {
      labels: Object.keys(datas),
      datasets: [
        {
          data: Object.values(datas),
          backgroundColor: [
            ...Object.values(datas).map((percentage) =>
              useUtils()
                .types.RGBToHex({
                  red: Math.round(255 - (percentage / 100) * 255),
                  green: Math.round(255 - (percentage / 100) * 255),
                  blue: 200
                })
                .toUpperCase()
            )
          ]
        }
      ]
    }
  }

  public static fromAppContributions(datas: Record<TAssetId, Record<TContributorEntry, TProportion>>): Record<string, IGraphData> {
    const graph: Record<string, IGraphData> = {}

    Object.entries(datas).forEach(([assetId, proportions]) => (graph[assetId] = GraphHelper.fromAssetContributions(proportions)))

    return graph
  }
}
