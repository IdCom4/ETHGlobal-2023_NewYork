export {}

declare global {
  // this is meant for day accuracy only
  interface IDateRange {
    begin: string
    end: string
  }

  interface IFlexibleDateRange {
    begin: string
    end?: string
  }

  // this is meant for up to second accuracy
  interface IDateTimeRange {
    begin: string
    end: string
  }
}
