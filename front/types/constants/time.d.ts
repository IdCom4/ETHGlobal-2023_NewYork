declare global {
  type Month = 'Janvier' | 'Février' | 'Mars' | 'Avril' | 'Mai' | 'Juin' | 'Juillet' | 'Août' | 'Septembre' | 'Octobre' | 'Novembre' | 'Décembre'
  type MonthShort = 'Jan' | 'Fév' | 'Mar' | 'Avr' | 'Mai' | 'Juin' | 'Juil' | 'Août' | 'Sept' | 'Oct' | 'Nov' | 'Déc'
  interface IMonth {
    FULL: Month
    SHORT: MonthShort
  }
}
export const MONTHS: IMonth[] = [
  { FULL: 'Janvier', SHORT: 'Jan' },
  { FULL: 'Février', SHORT: 'Fév' },
  { FULL: 'Mars', SHORT: 'Mars' },
  { FULL: 'Avril', SHORT: 'Avr' },
  { FULL: 'Mai', SHORT: 'Mai' },
  { FULL: 'Juin', SHORT: 'Juin' },
  { FULL: 'Juillet', SHORT: 'Juil' },
  { FULL: 'Août', SHORT: 'Août' },
  { FULL: 'Septembre', SHORT: 'Sep' },
  { FULL: 'Octobre', SHORT: 'Oct' },
  { FULL: 'Novembre', SHORT: 'Nov' },
  { FULL: 'Décembre', SHORT: 'Déc' }
]
