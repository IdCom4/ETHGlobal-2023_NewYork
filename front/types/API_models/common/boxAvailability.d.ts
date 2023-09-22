export {}

declare global {
  interface IBoxAvailability {
    //date is dd-MM-yyyy format
    [date: string]: {
      [boxId: string]: {
        // time is HH:mm format
        [time: string]: boolean
      }
    }
  }

  /*
a MutableMap<string, MutableMap<string, boolean>>
   *      level 1 key are specific individual box ids,
   *      level 2 keys are time slots of 15 minutes from box opening to closing hours that day (in 'HH:mm' format),
   *      and values are whether the box is available at that time slot or not.
   *
   *      (ex: <ID, <'08:45', true>>) */

  type TBoxId = string
  type TQuarterHourSlot = string // 'HH:mm' format
  type TDate = string // 'dd-MM-yyyy' format

  export type TBoxDateAvailabilityMap = Record<TQuarterHourSlot, boolean>
  export type TBoxWeekAvailabilityMap = Record<TDate, TBoxDateAvailabilityMap>
  export type TBoxesDateAvailabilityMap = Record<TBoxId, TBoxDateAvailabilityMap>
  export type TBoxCategoryMonthAvailabilityMap = Record<TDate, TBoxesDateAvailabilityMap>

  type TBoxCategory = 'WASHBOX' | 'MECABOX' | 'DETAILINGBOX'

  interface IBoxInfo {
    id: string
    centerId: string
    name: string
    description: string
    type: string
    category: TBoxCategory
    location: IAddress
    controllerId?: string
    formulas: IFormula[]
    shortAvailabilityPriority: boolean
    isAvailable: boolean
  }

  interface IDateAvailability {
    date: Date
    available: boolean
    availability: TBoxDateAvailabilityMap
  }
}
