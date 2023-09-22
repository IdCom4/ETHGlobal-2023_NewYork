export {}

declare global {
  interface IRealisation {
    id: number
    title: string
    description: string
    files?: IPublicFile[]
  }

  interface IProfessionalExperience {
    id: number
    enterprise: string
    role: string
    dateRange: IFlexibleDateRange
  }

  interface IStudy {
    id: number
    schoolName: string
    schoolAddress?: ILenientAddress
    grade: string
    description?: string
    dateRange: IFlexibleDateRange
  }

  interface IProfessionalHistory {
    studies?: IStudy[]
    professionalExperiences?: IProfessionalExperience[]
    realisations?: IRealisation[]
  }
}
