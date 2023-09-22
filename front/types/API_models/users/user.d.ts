export {}

declare global {
  interface ILiteUser {
    _id: string
    name: string
    lastName: string
    picture?: PublicFile
    professionalProfile?: ILiteProfessionalProfile
  }

  interface ILiteProfessionalUser extends ILiteUser {
    professionalProfile: ILiteProfessionalProfile
  }

  interface IUser extends ILiteUser {
    phone: string
    email: string
    sex: Sexes
    birthday?: string | null
    homeAddress?: IStrictAddress | null
    billingAddress?: ILenientAddress | null
    notifications?: INotification[] | null
    vehiclesId?: string[] | null
    centerClientProfile: CenterClientProfile
    missionClientProfile: MissionClientProfile
    professionalProfile?: IProfessionalProfile | null
    createdAt: string
  }

  interface IProfessionalUser extends IUser {
    professionalProfile: IProfessionalProfile
  }
}
