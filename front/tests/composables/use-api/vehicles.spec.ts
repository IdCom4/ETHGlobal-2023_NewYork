import { beforeAll, beforeEach, describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import * as useVehiclesEndpointExport from '@/composables/resources/api-endpoints/vehicles.endpoint'
import { allVehicles } from '@/tests/mockups/data/vehicles.mockup'
import { AlertModes, AlertStatuses, NOT_LOGGED_IN_REQUEST_ERROR } from '@/types/constants'
import { JohnDoe } from '@/tests/mockups/data/users.mockup'
import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

let alertStore: ReturnType<typeof useAlertStore>
let sessionStore: ReturnType<typeof useSessionStore>

beforeAll(() => {
  setActivePinia(createPinia())
  alertStore = useAlertStore()
  sessionStore = useSessionStore()
})

beforeEach(() => {
  alertStore.$reset()
  sessionStore.$reset()
  vi.resetAllMocks()
})

describe('when calling the /vehicles endpoints', () => {
  describe('when calling getMyVehicles method', () => {
    it('should return all my vehicles if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const myVehicles = allVehicles.filter((vehicle) => vehicle.ownerId === JohnDoe._id)

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle[]>().call_setReturnData(myVehicles).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().getMyVehicles()

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()

      expect(data).toBeDefined()
      if (!data) return
      expect(data).toEqual(myVehicles)

      expect(alertStore.alert).toBeNull()
    })

    it('should return an error if i am not logged in', async () => {
      const myVehicles = allVehicles.filter((vehicle) => vehicle.ownerId === JohnDoe._id)

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle[]>().call_setReturnData(myVehicles).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().getMyVehicles()

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(data).toBeFalsy()

      expect(alertStore.alert).toBeNull()
    })

    it('should return an error and send an error if i am not logged in and alertControl is set', async () => {
      sessionStore.logIn('token', JohnDoe)

      const alert = { mode: AlertModes.ALL, errorMsg: 'my custom error message' }

      const myVehicles = allVehicles.filter((vehicle) => vehicle.ownerId === JohnDoe._id)

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle[]>().call_setReturnData(myVehicles).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().getMyVehicles(alert)

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(data).toBeFalsy()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(alert.errorMsg)
    })
  })

  describe('when calling addVehicle method', () => {
    const newVehicle: INewVehicleRequest = {
      brandId: 'Ferrari',
      model: 'Spider',
      plate: 'XX-456-XX',
      year: 2015,
      mileage: 12000
    }

    const expectedVehicleResponse = {
      _id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      ownerId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
      pictures: [],
      history: [],
      invoiceIds: [],
      ...newVehicle
    }

    it('should add a new vehicle if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const alert = { mode: AlertModes.ALL, successMsg: 'Nouveau véhicule créé !' }

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle>().call_setReturnData(expectedVehicleResponse).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicle, alert)

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()

      expect(data).toBeDefined()
      if (!data) return
      expect(data).toEqual(expectedVehicleResponse)

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(alert.successMsg)
    })

    it('should return an error if i am not logged in', async () => {
      sessionStore.logOut()

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle>().call_setReturnData(expectedVehicleResponse).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicle)

      expect(useFetchMock.callSpy).toHaveBeenCalledTimes(0)

      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)

      expect(data).toBeFalsy()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
    })

    it('should return an error if my request is invalid', async () => {
      sessionStore.logIn('token', JohnDoe)

      // no brand
      const noBrandError = { status: 400, message: 'Véhicule invalide, la marque est obligatoire' }
      const newVehicleWithoutBrand = JSON.parse(JSON.stringify(newVehicle))
      delete newVehicleWithoutBrand.brand

      // const useFetchMock = new UseFetchWrapperMockBuilder<IVehicle[]>().call_setReturnData(expectedVehicleResponse).build()

      const noBrandResponse = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicleWithoutBrand)

      // expect(useFetchMock.callSpy).toHaveBeenCalled()
      expect(noBrandResponse.data).toBeFalsy()

      expect(noBrandResponse.error).toBeDefined()
      if (!noBrandResponse.error) return
      expect(noBrandResponse.error.status).toEqual(noBrandError.status)
      expect(noBrandResponse.error.message).toEqual(noBrandError.message)

      // no model
      const noModelError = { status: 400, message: 'Véhicule invalide, le modèle est obligatoire' }
      const newVehicleWithoutModel = JSON.parse(JSON.stringify(newVehicle))
      delete newVehicleWithoutModel.model

      // const useFetchMock = new UseFetchWrapperMockBuilder<IVehicle[]>().call_setReturnData(expectedVehicleResponse).build()

      const noModelResponse = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicleWithoutModel)

      // expect(useFetchMock.callSpy).toHaveBeenCalled()
      expect(noModelResponse.data).toBeFalsy()

      expect(noModelResponse.error).toBeDefined()
      if (!noModelResponse.error) return
      expect(noModelResponse.error.status).toEqual(noModelError.status)
      expect(noModelResponse.error.message).toEqual(noModelError.message)

      // no plate
      const noPlateError = { status: 400, message: "Véhicule invalide, la plaque d'immatriculation est obligatoire" }
      const newVehicleWithoutPlate = JSON.parse(JSON.stringify(newVehicle))
      delete newVehicleWithoutPlate.plate

      // const useFetchMock = new UseFetchWrapperMockBuilder<IVehicle[]>().call_setReturnData(expectedVehicleResponse).build()

      const noPlateResponse = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicleWithoutPlate)

      // expect(useFetchMock.callSpy).toHaveBeenCalled()
      expect(noPlateResponse.data).toBeFalsy()

      expect(noPlateResponse.error).toBeDefined()
      if (!noPlateResponse.error) return
      expect(noPlateResponse.error.status).toEqual(noPlateError.status)
      expect(noPlateResponse.error.message).toEqual(noPlateError.message)

      // no year
      const noYearError = { status: 400, message: "Véhicule invalide, l'année est obligatoire" }
      const newVehicleWithoutYear = JSON.parse(JSON.stringify(newVehicle))
      delete newVehicleWithoutYear.year

      // const useFetchMock = new UseFetchWrapperMockBuilder<IVehicle[]>().call_setReturnData(expectedVehicleResponse).build()

      const noYearResponse = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicleWithoutYear)

      // expect(useFetchMock.callSpy).toHaveBeenCalled()
      expect(noYearResponse.data).toBeFalsy()

      expect(noYearResponse.error).toBeDefined()
      if (!noYearResponse.error) return
      expect(noYearResponse.error.status).toEqual(noYearError.status)
      expect(noYearResponse.error.message).toEqual(noYearError.message)

      // no year
      const noMileageError = { status: 400, message: 'Véhicule invalide, le kilométrage est obligatoire' }
      const newVehicleWithoutMileage = JSON.parse(JSON.stringify(newVehicle))
      delete newVehicleWithoutMileage.mileage

      // const useFetchMock = new UseFetchWrapperMockBuilder<IVehicle[]>().call_setReturnData(expectedVehicleResponse).build()

      const noMileageResponse = await useVehiclesEndpointExport.useVehiclesEndpoint().addVehicle(newVehicleWithoutMileage)

      // expect(useFetchMock.callSpy).toHaveBeenCalled()
      expect(noMileageResponse.data).toBeFalsy()

      expect(noMileageResponse.error).toBeDefined()
      if (!noMileageResponse.error) return
      expect(noMileageResponse.error.status).toEqual(noMileageError.status)
      expect(noMileageResponse.error.message).toEqual(noMileageError.message)
    })
  })

  describe('when calling updateVehicle method', () => {
    const vehicleToUpdate = allVehicles[0]
    const updateVehicleRequest: IUpdateVehicleRequest = {
      _id: vehicleToUpdate._id,
      brandId: 'Fiat',
      model: 'Punto',
      year: 1037
    }
    const expectedUpdatedVehicle: IOwnerVehicle = {
      ...vehicleToUpdate,
      ...updateVehicleRequest
    }

    it('should return the updated vehicle and send an alert if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)
      const alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Véhicule mis à jour avec succès !' }

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle>().call_setReturnData(expectedUpdatedVehicle).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().updateVehicle(updateVehicleRequest, alert)

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toEqual(expectedUpdatedVehicle)
      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(alert.successMsg)
    })

    it('should return the updated vehicle and no alert if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle>().call_setReturnData(expectedUpdatedVehicle).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().updateVehicle(updateVehicleRequest, { mode: AlertModes.NONE })

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toEqual(expectedUpdatedVehicle)
      expect(alertStore.alert).toBeFalsy()
    })

    it('should return an error if i am not logged In', async () => {
      sessionStore.logOut()

      const useFetchMock = new UseFetchWrapperMockBuilder<IOwnerVehicle>().call_setReturnData(expectedUpdatedVehicle).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().updateVehicle(updateVehicleRequest, { mode: AlertModes.NONE })

      expect(useFetchMock.callSpy).toHaveBeenCalledTimes(0)

      expect(data).toBeFalsy()
      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
      expect(alertStore.alert).toBeFalsy()
    })
  })

  describe('when calling deleteVehicle method', () => {
    const vehicleId = allVehicles[0]._id

    it('should delete the vehicle if i am logged in', async () => {
      sessionStore.logIn('token', JohnDoe)

      const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturn({ data: null, error: null }).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().deleteVehicle(vehicleId, { mode: AlertModes.NONE })

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toBeFalsy()
      expect(alertStore.alert).toBeFalsy()
    })

    it('should delete the vehicle and send an alert if i am logged in and alertControl is set', async () => {
      sessionStore.logIn('token', JohnDoe)
      const alert: IAlertControl = { mode: AlertModes.ALL, successMsg: 'Véhicule supprimé avec succès !' }

      const useFetchMock = new UseFetchWrapperMockBuilder().call_setReturn({ data: null, error: null }).build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().deleteVehicle(vehicleId, alert)

      expect(useFetchMock.callSpy).toHaveBeenCalled()

      expect(error).toBeFalsy()
      expect(data).toBeFalsy()
      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.SUCCESS)
      expect(alertStore.alert.message).toEqual(alert.successMsg)
    })

    it('should return an error if i am not logged in', async () => {
      sessionStore.logOut()
      const useFetchMock = new UseFetchWrapperMockBuilder().build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().deleteVehicle(vehicleId, { mode: AlertModes.NONE })

      expect(useFetchMock.callSpy).toHaveBeenCalledTimes(0)

      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
      expect(data).toBeFalsy()
      expect(alertStore.alert).toBeFalsy()
    })

    it('should return an error and send an alert if i am not logged in and alertControl is set', async () => {
      sessionStore.logOut()

      const useFetchMock = new UseFetchWrapperMockBuilder().build()

      const { data, error } = await useVehiclesEndpointExport.useVehiclesEndpoint().deleteVehicle(vehicleId)

      expect(useFetchMock.callSpy).toHaveBeenCalledTimes(0)

      expect(error).toBeDefined()
      if (!error) return
      expect(error.status).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.status)
      expect(error.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
      expect(data).toBeFalsy()

      expect(alertStore.alert).toBeTruthy()
      if (!alertStore.alert) return
      expect(alertStore.alert.status).toEqual(AlertStatuses.ERROR)
      expect(alertStore.alert.message).toEqual(NOT_LOGGED_IN_REQUEST_ERROR.message)
    })
  })
})
