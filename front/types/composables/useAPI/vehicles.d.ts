export {}

declare global {
  interface INewVehicleRequest {
    plate: string
    brandId: string
    model: string
    year: number
    mileage: number
  }

  interface IUpdateVehicleRequest extends Partial<INewVehicleRequest> {
    _id: string
  }
}

export class VehicleRequestBuilder {
  constructor(private readonly vehicle: INewVehicleRequest | IUpdateVehicleRequest) {}

  toNewVehicleRequest(): INewVehicleRequest {
    if (!this.vehicle.plate) throw new Error("Véhicule invalide, la plaque d'immatriculation est obligatoire")
    if (!this.vehicle.brandId) throw new Error('Véhicule invalide, la marque est obligatoire')
    if (!this.vehicle.model) throw new Error('Véhicule invalide, le modèle est obligatoire')
    if (!this.vehicle.year) throw new Error("Véhicule invalide, l'année est obligatoire")
    if (!Number.isInteger(this.vehicle.mileage) || this.vehicle.mileage < 0) throw new Error('Véhicule invalide, le kilométrage est obligatoire')

    const request: INewVehicleRequest = {
      plate: this.vehicle.plate.toUpperCase(),
      brandId: this.vehicle.brandId,
      model: this.vehicle.model,
      year: this.vehicle.year,
      mileage: this.vehicle.mileage
    }

    return request
  }

  toUpdateVehicleRequest(): IUpdateVehicleRequest {
    if (!this.vehicle._id) throw new Error('Véhicule invalide, un id est obligatoire')

    const request: IUpdateVehicleRequest = {
      _id: this.vehicle._id,
      ...this.toNewVehicleRequest()
    }

    return request
  }
}
