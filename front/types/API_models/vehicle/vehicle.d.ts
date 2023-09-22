export {}

declare global {
  interface IVehiclePayload {
    model: string
    brand: string
    year: number
    plate: string
    mileage: number
  }

  interface IGuestVehicle extends IVehiclePayload {
    _id: string
    ownerId: string
  }

  interface IOwnerVehicle extends IGuestVehicle {
    invoiceIds: string[]
  }

  interface IAdminVehicle extends IOwnerVehicle {
    deletedAt?: Date
  }

  interface IVehicleBrand {
    _id: string
    name: string
    vehicleType: 'CAR' | 'MOTORCYCLE'
  }

  interface IVehicleIntervention {
    _id: string
    label: string
    category: string
  }
}
