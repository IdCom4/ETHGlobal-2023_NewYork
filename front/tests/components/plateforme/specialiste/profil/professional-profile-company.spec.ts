import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import professionalProfileCompany from '@/components/plateforme/specialiste/profil/professional-profile-company.client.vue'
import { JohnDoe } from '@/tests/data-mockups/users'
import { setActivePinia, createPinia } from 'pinia'

import * as useRequestExport from '@/composables/useRequest'
import * as useProfessionalsExport from '@/composables/resources/api-endpoints/professionals'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('I am a professional logged', () => {
  // we try to access to properties of the component that vm does not know
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  /* Siret HBRECOVERY */
  // const mockSiret = '88209112700010'
  const mockResponse: InseeCompany = {
    etablissement: {
      uniteLegale: {
        categorieJuridiqueUniteLegale: '5710',
        denominationUniteLegale: 'HBRECOVERY',
        activitePrincipaleUniteLegale: '64.20Z'
      },
      adresseEtablissement: {
        numeroVoieEtablissement: '10',
        typeVoieEtablissement: 'RUE',
        libelleVoieEtablissement: 'JEAN PERRIN',
        libelleCommuneEtablissement: 'LA ROCHELLE',
        codeCommuneEtablissement: '17300'
      }
    }
  }

  const useRequestSpy = vi.spyOn(useRequestExport, 'useRequest').mockImplementation(() => ({
    get: vi.fn(
      async () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<RequestResult<any>>((resolve) => {
          // return mocked data
          resolve({ data: mockResponse, error: null })
        })
    )
  }))

  const useProfessionalSpy = vi.spyOn(useProfessionalsExport, 'useProfessionalsEndpoint').mockImplementation(() => ({
    updateProfile: vi.fn(
      async () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<RequestResult<any>>((resolve) => {
          // return mocked data
          resolve({ data: mockResponse, error: null })
        })
    )
  }))

  beforeEach(() => {
    wrapper = shallowMount(professionalProfileCompany, {
      props: {
        professionalProfile: JohnDoe.professionalProfile
      },
      global: { stubs: { fa: true } }
    })
  })
  it('could declare if I have a company or not', async () => {
    await new Promise((res) => setTimeout(res, 1000))

    const buttonNo = wrapper.find('input.no')
    const buttonYes = wrapper.find('input.yes')

    await buttonNo.trigger('click')

    expect(wrapper.find('div.siret').exists()).toBeFalsy()

    await buttonYes.trigger('click')
    expect(wrapper.find('div.siret').exists()).toBeTruthy()
  })

  it('should do a request to the INSEE api when clicking on the button then update profile', async () => {
    const button = wrapper.find('button.request-button')

    await button.trigger('click')
    expect(useRequestSpy).toHaveBeenCalled()
    expect(useProfessionalSpy).toHaveBeenCalled()
  })

  /*it('should display company infos', () => {
    if (!JohnDoe.professionalProfile.company) return

    expect(wrapper.vm.companyData.naf).toMatch(JohnDoe.professionalProfile.company.naf)
    expect(wrapper.vm.companyData.legalForm).toMatch(JohnDoe.professionalProfile.company.legalForm)
    expect(wrapper.vm.companyData.denomination).toMatch(JohnDoe.professionalProfile.company.denomination)
    expect(wrapper.vm.companyData.legalAddress.street).toMatch(JohnDoe.professionalProfile.company.legalAddress.street)
    expect(wrapper.vm.companyData.legalAddress.zipCode).toMatch(JohnDoe.professionalProfile.company.legalAddress.zipCode)
    expect(wrapper.vm.companyData.legalAddress.city).toMatch(JohnDoe.professionalProfile.company.legalAddress.city)
  })*/
})
