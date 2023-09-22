import { Sex } from '@/common/enums'
import { ConvertPojoToInstance } from '@Common/classes'
import { LenientAddress, LenientAddressBlueprint } from '@Schemas/common/pojos'
import { User } from '@Schemas/user'
import { UserBlueprint } from '@Schemas/user/user.blueprint'

describe('ConvertPojoToInstance', () => {
  describe('When converting plain old JavaScript objects to an instance of a class without specifying the multiplicity', () => {
    it('should success with a single object', () => {
      // Given
      const lenientAddressPojo = {
        _street: '123 Main Street',
        _city: 'Anytown',
        _zipCode: '12345',
      }

      // When
      const lenientAddressInstance = <LenientAddress>ConvertPojoToInstance.convert<
        LenientAddress,
        TClassConstructor<LenientAddress>,
        LenientAddressBlueprint
      >(lenientAddressPojo, {
        targetClass: LenientAddress,
      })

      // Given
      expect(lenientAddressInstance).toBeTruthy()
      expect(lenientAddressInstance).toBeInstanceOf(LenientAddress)
      expect(lenientAddressInstance.street).toBe('123 Main Street')
      expect(lenientAddressInstance.city).toBe('Anytown')
      expect(lenientAddressInstance.zipCode).toBe('12345')
    })

    it('should success with an array of objects', () => {
      // Given
      const lenientAddressListPojo = [
        {
          _street: '123 Main Street',
          _city: 'Anytown',
          _zipCode: '12345',
        },
        {
          _street: '321 Second Street',
          _city: 'Anothertown',
          _zipCode: '54321',
        },
      ]

      // When
      const lenientAddressInstances = <LenientAddress[]>ConvertPojoToInstance.convert<
        LenientAddress,
        TClassConstructor<LenientAddress>,
        LenientAddressBlueprint
      >(lenientAddressListPojo, {
        targetClass: LenientAddress,
      })

      // Given
      expect(lenientAddressInstances).toBeTruthy()
      expect(lenientAddressInstances[0]).toBeTruthy()
      expect(lenientAddressInstances[0]).toBeInstanceOf(LenientAddress)
      expect(lenientAddressInstances[0].street).toBe('123 Main Street')
      expect(lenientAddressInstances[0].city).toBe('Anytown')
      expect(lenientAddressInstances[0].zipCode).toBe('12345')
      expect(lenientAddressInstances[1]).toBeTruthy()
      expect(lenientAddressInstances[1]).toBeInstanceOf(LenientAddress)
      expect(lenientAddressInstances[1].street).toBe('321 Second Street')
      expect(lenientAddressInstances[1].city).toBe('Anothertown')
      expect(lenientAddressInstances[1].zipCode).toBe('54321')
    })
  })

  it('should success when specially converting an array of plain old JavaScript objects to an instance of a class', () => {
    // Given
    const lenientAddressListPojo = [
      {
        _street: '123 Main Street',
        _city: 'Anytown',
        _zipCode: '12345',
      },
      {
        _street: '321 Second Street',
        _city: 'Anothertown',
        _zipCode: '54321',
      },
    ]

    // When
    const lenientAddressInstances = ConvertPojoToInstance.convertArray<LenientAddress, TClassConstructor<LenientAddress>, LenientAddressBlueprint>(
      lenientAddressListPojo,
      { targetClass: LenientAddress }
    )

    // Given
    expect(lenientAddressInstances).toBeTruthy()
    expect(lenientAddressInstances[0]).toBeTruthy()
    expect(lenientAddressInstances[0].street).toBe('123 Main Street')
    expect(lenientAddressInstances[0].city).toBe('Anytown')
    expect(lenientAddressInstances[0].zipCode).toBe('12345')
    expect(lenientAddressInstances[1]).toBeTruthy()
    expect(lenientAddressInstances[1].street).toBe('321 Second Street')
    expect(lenientAddressInstances[1].city).toBe('Anothertown')
    expect(lenientAddressInstances[1].zipCode).toBe('54321')
  })

  describe('When specially converting a single pojo to an instance of a class', () => {
    it('should success with nominal value', () => {
      // Given
      const lenientAddressPojo = {
        _street: '123 Main Street',
        _city: 'Anytown',
        _zipCode: '12345',
      }

      // When
      const lenientAddressInstance = ConvertPojoToInstance.convertOne<LenientAddress, TClassConstructor<LenientAddress>, LenientAddressBlueprint>(
        lenientAddressPojo,
        { targetClass: LenientAddress }
      )

      // Given
      expect(lenientAddressInstance).toBeTruthy()
      expect(lenientAddressInstance.street).toBe('123 Main Street')
      expect(lenientAddressInstance.city).toBe('Anytown')
      expect(lenientAddressInstance.zipCode).toBe('12345')
    })

    it('should success with omitted property leaving them falsy', () => {
      // Given
      const userPojo = {
        _id: '642beaab483d9a5795288890',
        _name: 'John',
        _lastName: 'Doe',
        _phone: '0612345678',
        _email: 'john@doe.fr',
        _hashedPassword: '$argon2id$v=19$m=65536,t=3,p=4$Gp7nVU5bVfsDvJ43nmarow$jBKH3HbpDD7ZrKy+klyqJ5H3j2JLn44NgWGmxl3rwF8',
        _sex: Sex.MAN,
        _picture: undefined,
        _homeAddress: {
          _street: '123 Main Street',
          _city: 'Anytown',
          _zipCode: '12345',
          _coordinates: [0, 0] as [number, number],
        },
        _notifications: [],
        _vehiclesId: [] as string[],
        _centerClientProfile: {
          _cgu: true,
          _notificationPreferences: {
            bookingValidated: {
              email: true,
              sms: true,
            },
            bookingCancelled: {
              email: true,
              sms: true,
            },
          },
          _bookingsId: [],
        },
        _missionClientProfile: {
          cgu: true,
          notificationPreferences: {
            newQuoteReceived: {
              email: true,
              sms: true,
            },
            missionFinished: {
              email: true,
              sms: true,
            },
            newMissionProposal: {
              email: true,
              sms: true,
            },
            missionCancelledByProfessional: {
              email: true,
              sms: true,
            },
          },
          missionsId: [],
          favoriteProfessionalsId: [],
        },
        _professionalProfile: undefined,
        _billingAddress: {
          _street: '123 Main Street',
          _city: 'Anytown',
          _zipCode: '12345',
        },
        _vmcComments: [],
        _isEmailValidated: true,
        _lastLogin: new Date('2023-04-04T09:15:23.490Z'),
        _isAdmin: false,
        _currentHashedRefreshToken: null,
        _passwordRecoverToken: null,
        _birthday: new Date('2023-05-02T09:47:16.521Z'),
        createdAt: new Date('2023-04-04T09:15:23.996Z'),
        updatedAt: new Date('2023-04-04T09:15:23.996Z'),
        _deletedAt: undefined,
        __v: 0,
      }

      // When
      const userInstance = ConvertPojoToInstance.convertOne<User, TClassConstructor<User>, UserBlueprint>(userPojo, {
        targetClass: User,
        propertiesToOmit: ['_hashedPassword', { _billingAddress: ['coordinates'] }],
      })

      // Given
      expect(userInstance).toBeTruthy()
      expect(userInstance.name).toBe('John')
      expect(userInstance.billingAddress).toBeTruthy()
      expect(userInstance.billingAddress?.coordinates).toBeFalsy()
    })

    it('should success with properties to omit leaving them undefined', () => {
      // Given
      const userPojo = {
        _id: '642beaab483d9a5795288890',
        _name: 'John',
        _lastName: 'Doe',
        _phone: '0612345678',
        _email: 'john@doe.fr',
        _hashedPassword: '$argon2id$v=19$m=65536,t=3,p=4$Gp7nVU5bVfsDvJ43nmarow$jBKH3HbpDD7ZrKy+klyqJ5H3j2JLn44NgWGmxl3rwF8',
        _sex: Sex.MAN,
        _picture: undefined,
        _homeAddress: {
          _street: '123 Main Street',
          _city: 'Anytown',
          _zipCode: '12345',
          _coordinates: [0, 0] as [number, number],
        },
        _notifications: [],
        _vehiclesId: [] as string[],
        _centerClientProfile: {
          _cgu: true,
          _notificationPreferences: {
            bookingValidated: {
              email: true,
              sms: true,
            },
            bookingCancelled: {
              email: true,
              sms: true,
            },
          },
          _bookingsId: [],
        },
        _missionClientProfile: {
          cgu: true,
          notificationPreferences: {
            newQuoteReceived: {
              email: true,
              sms: true,
            },
            missionFinished: {
              email: true,
              sms: true,
            },
            newMissionProposal: {
              email: true,
              sms: true,
            },
            missionCancelledByProfessional: {
              email: true,
              sms: true,
            },
          },
          missionsId: [],
          favoriteProfessionalsId: [],
        },
        _professionalProfile: undefined,
        _billingAddress: {
          _street: '123 Main Street',
          _city: 'Anytown',
          _zipCode: '12345',
        },
        _vmcComments: [],
        _isEmailValidated: true,
        _lastLogin: new Date('2023-04-04T09:15:23.490Z'),
        _isAdmin: false,
        _currentHashedRefreshToken: null,
        _passwordRecoverToken: null,
        _birthday: new Date('2023-05-02T09:47:16.521Z'),
        createdAt: new Date('2023-04-04T09:15:23.996Z'),
        updatedAt: new Date('2023-04-04T09:15:23.996Z'),
        _deletedAt: undefined,
        __v: 0,
      }

      // When
      const userInstance = ConvertPojoToInstance.convertOne<User, TClassConstructor<User>, UserBlueprint>(userPojo, {
        targetClass: User,
        propertiesToOmit: ['_hashedPassword', { _billingAddress: ['coordinates'] }],
      })

      // Given
      expect(userInstance).toBeTruthy()
      expect(userInstance.name).toBe('John')
    })
  })
})
