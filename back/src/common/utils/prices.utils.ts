/**
 * Utils responsible for the business logic of price calculations.
 */
export class PricesUtils {
  /* >==== BASIC DATA ====> */
  /**
   * Calculates the TTC price from the HT price and the TVA rate.
   * @param {number} HTPrice The HT price.
   * @param {number} TVARate The TVA rate.
   * @returns {number}       The TTC price.
   */
  public static getTTCFromHT(HTPrice: number, TVARate: number): number {
    return HTPrice + PricesUtils.getTVAFromHT(HTPrice, TVARate)
  }

  /**
   * Calculates the HT price from the TTC price and the TVA rate.
   * @param {number} TTCPrice The TTC price.
   * @param {number} TVARate  The TVA rate.
   * @returns {number}        The HT price.
   */
  public static getHTFromTTC(TTCPrice: number, TVARate: number): number {
    return TTCPrice / (1 + TVARate / 100)
  }

  /**
   * Calculates the TVA value for an HT price based on the TVA rate.
   * @param {number} HTPrice The HT price.
   * @param {number} TVARate The TVA rate.
   * @returns {number}       The TVA value
   */
  public static getTVAFromHT(HTPrice: number, TVARate: number): number {
    return HTPrice * (TVARate / 100)
  }

  /* >==== SPECIFIC DATA ====> */
  /**
   * Calculates the TTC price from the HT price considering a given reduction.
   * @param {number}   TTCPriceBeforeReduction The TTC price before reduction.
   * @param {number}   reductionPercentage     The reduction percentage.
   * @returns {number}                         The TTC price.
   */
  public static getTTCWithReduction(TTCPriceBeforeReduction: number, reductionPercentage: number): number {
    return TTCPriceBeforeReduction * (1 - reductionPercentage / 100)
  }

  /**
   * Calculates a commission of a TTC price given a comission percentage.
   * @param TTCPrice             The TTC price.
   * @param commissionPercentage The commission percentage.
   * @returns {number}           The TTC price with the given commission.
   */
  public static getTTCCommissionFromPercentage(TTCPrice: number, commissionPercentage: number): number {
    return (TTCPrice / 100) * commissionPercentage
  }
}
