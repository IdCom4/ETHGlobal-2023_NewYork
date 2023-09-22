export {}

declare global {
  type TWeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

  interface ITimeRange {
    begin: string
    end: string
  }

  interface ICenter {
    _id: string
    name: string
    location: IAddress
    openingHours: Record<TWeekDay, ITimeRange>
  }

  type TBoxCategoriesFormulas = Record<TBoxCategory, IFormula[]>
}
