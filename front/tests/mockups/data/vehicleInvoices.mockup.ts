export const vehicleInvoices: IVehicleInvoice[] = [
  {
    _id: '001',
    mileage: 75000,
    interventions: [
      {
        _id: 'I001',
        label: 'Vidange',
        category: ''
      },
      {
        _id: 'I002',
        label: 'Courroie',
        category: ''
      },
      {
        _id: 'I003',
        label: 'Frein',
        category: ''
      }
    ],
    hostedFileReferenceId: 'test',
    madeAt: '01/01/2023'
  },
  {
    _id: '002',
    mileage: 90000,
    interventions: [
      {
        _id: 'I004',
        label: 'Disque de frein',
        category: ''
      }
    ],
    hostedFileReferenceId: '',
    madeAt: '02/02/2023'
  },
  {
    _id: '003',
    mileage: 120000,
    interventions: [
      {
        _id: 'I005',
        label: 'Essuie glace',
        category: ''
      },
      {
        _id: 'I006',
        label: 'Pare-brise',
        category: ''
      }
    ],
    hostedFileReferenceId: '',
    madeAt: '03/03/2023'
  }
]
