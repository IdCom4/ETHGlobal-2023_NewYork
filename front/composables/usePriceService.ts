export const usePriceService = () => {
  const functions = {
    getTTCFromHT(HTPrice: number, TVARate: number): number {
      return HTPrice + functions.getTVAFromHT(HTPrice, TVARate)
    },
    getHTFromTTC(TTCPrice: number, TVARate: number): number {
      return TTCPrice / (1 + TVARate)
    },
    getTVAFromHT(HTPrice: number, TVARate: number): number {
      return HTPrice * TVARate
    },
    getTTCWithReduction(TTCPriceBeforeReduction: number, reductionPercentage: number): number {
      return TTCPriceBeforeReduction * (1 - reductionPercentage / 100)
    },
    getTTCCommissionFromPercentage(TTCPrice: number, commissionPercentage: number): number {
      return (TTCPrice / 100) * commissionPercentage
    }
  }

  return functions
}
