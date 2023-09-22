/* Send a number in this function to get €uro unit. Ex: put 35 it will return "35,00€"*/
export const useEuroUnit = (price: number) => price.toFixed(2) + '€'
