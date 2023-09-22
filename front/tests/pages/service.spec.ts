import Service from '@/pages/centres/services/service/[slug].vue'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { centerServices, serviceOptions } from '../mockups/data/center-services.mockup'
import { UseFetchWrapperMockBuilder } from '../mockups/functions/APIs'

describe('Service', () => {
  let wrapper: VueWrapper

  // ! creating 2 mocks this way won't work, the second one will override the first
  // TODO: use => new UseFetchWrapperMockBuilder<ICenterService[]>().call_setDynamicResponse() instead
  const mockBuilderService = new UseFetchWrapperMockBuilder<ICenterService[]>().call_setReturnData(centerServices).build()
  const mockBuilderOptions = new UseFetchWrapperMockBuilder<IServiceOption[]>().call_setReturnData(serviceOptions).build()

  // TODO: remove unused code
  // const mockedServices: Array<ICenterService> = [
  //   {
  //     id: 'xxxx000016',
  //     title: 'Lavage exterieur & interieur',
  //     numberOfSales: 1,
  //     subtitle: '',
  //     prices: {
  //       priceTTC2Seats: 69,
  //       priceTTC5Seats: 99,
  //       priceTTC7Seats: 129
  //     },
  //     picture: 'https://picsum.photos/id/200/600/1100',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare magna at augue luctus, ac ultrices lacus tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisi. Sed ut velit ullamcorper, vehicula mi et, finibus purus. Nunc eget ligula vel metus ullamcorper placerat. Praesent nec sagittis neque. Donec auctor diam nec lacus euismod, non feugiat ex luctus. Integer id odio ipsum.',
  //     isActive: true,
  //     categories: ['WASH'],
  //     optionsId: [
  //       'opt-serv_01',
  //       'opt-serv_02',
  //       'opt-serv_03',
  //       'opt-serv_04',
  //       'opt-serv_05',
  //       'opt-serv_06',
  //       'opt-serv_07',
  //       'opt-serv_08',
  //       'opt-serv_10',
  //       'opt-serv_12',
  //       'opt-serv_14',
  //       'opt-serv_15',
  //       'opt-serv_16',
  //       'opt-serv_17',
  //       'opt-serv_18',
  //       'opt-serv_19',
  //       'opt-serv_20',
  //       'opt-serv_21',
  //       'opt-serv_22',
  //       'opt-serv_23',
  //       'opt-serv_24'
  //     ]
  //   },
  //   {
  //     id: 'xxxx00001',
  //     title: 'Destickage',
  //     numberOfSales: 9999,
  //     subtitle: '',
  //     picture: 'https://picsum.photos/id/216/600/1100',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare magna at augue luctus, ac ultrices lacus tristique. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisi. Sed ut velit ullamcorper, vehicula mi et, finibus purus. Nunc eget ligula vel metus ullamcorper placerat. Praesent nec sagittis neque. Donec auctor diam nec lacus euismod, non feugiat ex luctus. Integer id odio ipsum.',
  //     isActive: true
  //   }
  // ]
  beforeAll(() => {
    setActivePinia(createPinia())
    wrapper = shallowMount(Service)

    expect(wrapper.exists()).toBeTruthy()
    expect(mockBuilderService.callSpy).toHaveBeenCalled()
    expect(mockBuilderOptions.callSpy).toHaveBeenCalled()
  })

  it('should get service with options', () => {
    const mockSlugURL = 'xxxx000016'
    const selectedService = centerServices.find((service) => service.id === mockSlugURL)

    expect(selectedService).toBeTruthy()
    expect(selectedService?.optionsId?.length).toBeGreaterThan(0)
    it('should see the "TOTAL HORS OPTIONS" on page', () => {
      const totalWithoutOptions = wrapper.find('.main-service__right-side--totalOptionsPrice')

      expect(totalWithoutOptions.exists()).toBeTruthy()
    })
  })

  it('should get service without options', () => {
    // const serviceWithoutPrices: Array<ICenterService> = []
    // mockedServices.forEach((service) => {
    //   !service.prices && serviceWithoutPrices.push(service)
    // })
    // serviceWithoutPrices.find((service) => service.id === mockSlugURL)

    const mockSlugURL = 'xxxx00001'
    const selectedService = centerServices.find((service) => service.id === mockSlugURL)

    const vehiclesTypesContainer = wrapper.find('.selected')

    expect(vehiclesTypesContainer.exists()).toBeFalsy()
    expect(selectedService).toBeTruthy()
    expect(selectedService?.optionsId?.length).toBeNull()
  })
  it('should not see the dropdown to select vehicles types', () => {
    // const mockSlugURL = 'xxxx00001'
    // serviceWithoutPrices.find((service) => service.id === mockSlugURL)

    const vehiclesTypesContainer = wrapper.find('.selected')

    expect(vehiclesTypesContainer.exists()).toBeFalsy()
  })

  it('should have all options his options in a list', async () => {
    // const optionsContainer = wrapper.find('.options-list')
  })
})
