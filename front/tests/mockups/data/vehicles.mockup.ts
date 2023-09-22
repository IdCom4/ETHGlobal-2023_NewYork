export const allVehicles: IOwnerVehicle[] = [
  {
    _id: '001',
    ownerId: '001',
    plate: 'xx-456-xx',
    brand: 'Ferrari',
    model: 'Spider',
    year: 2015,
    mileage: 25160,
    pictures: [],
    history: [],
    invoiceIds: ['001', '002']
  },
  {
    _id: '002',
    ownerId: '002',
    plate: 'yy-789-yy',
    brand: 'Tesla',
    model: 'Model S',
    year: 2020,
    mileage: 15000,
    pictures: [],
    history: [],
    invoiceIds: ['003']
  },
  {
    _id: '003',
    ownerId: '001',
    plate: 'zz-123-zz',
    brand: 'Bugatti',
    model: 'Veyron',
    year: 2016,
    mileage: 32000,
    pictures: [],
    history: [],
    invoiceIds: []
  }
]

export const vehiclesInterventions = [
  {
    vehicleId: '001',
    ownerId: '001',
    plate: 'xx-456-xx',
    mileage: 5003,
    interventions: 'vidange',
    invoiceId: '001',
    technicalControlId: [],
    madeAt: '01/01/2020'
  },
  {
    vehicleId: '003',
    ownerId: '001',
    plate: 'xx-789-xx',
    mileage: 6000,
    interventions: 'freins',
    invoiceId: '002',
    technicalControlId: [],
    madeAt: '15/02/2020'
  },
  {
    vehicleId: '001',
    ownerId: '001',
    plate: 'xx-456-xx',
    mileage: 10003,
    interventions: 'vidange',
    invoiceId: '10001',
    technicalControlId: [],
    madeAt: '05/01/2021'
  },
  {
    vehicleId: '001',
    ownerId: '001',
    plate: 'xx-456-xx',
    mileage: 15003,
    interventions: 'vidange',
    invoiceId: '001',
    technicalControlId: [],
    madeAt: '01/02/2023'
  }
]

export const brandVehicles: IVehicleBrand[] = [
  {
    _id: '1',
    name: 'Tesla',
    vehicleType: 'CAR'
  },
  {
    _id: '2',
    name: 'Ford',
    vehicleType: 'CAR'
  },
  {
    _id: '3',
    name: 'BMW',
    vehicleType: 'CAR'
  },
  {
    _id: '4',
    name: 'Audi',
    vehicleType: 'CAR'
  },
  {
    _id: '5',
    name: 'Mercedes-Benz',
    vehicleType: 'CAR'
  }
]
