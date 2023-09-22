declare global {
  type Month = 'Janvier' | 'Février' | 'Mars' | 'Avril' | 'Mai' | 'Juin' | 'Juillet' | 'Août' | 'Septembre' | 'Octobre' | 'Novembre' | 'Décembre'
  type MonthShort = 'Jan' | 'Fév' | 'Mar' | 'Avr' | 'Mai' | 'Juin' | 'Juil' | 'Août' | 'Sept' | 'Oct' | 'Nov' | 'Déc'
  interface IMonth {
    FULL: Month
    SHORT: MonthShort
  }
}
