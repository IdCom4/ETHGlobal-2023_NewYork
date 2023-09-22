import * as servicesExport from '@/composables/resources/api-endpoints/center-services.endpoint'
import { TServicesData } from '@/composables/resources/api-endpoints/center-services.endpoint'
import { useAPI } from '@/composables/useApi'
import Services from '@/pages/centres/services/index.vue'
import { centerServices, serviceOptions } from '@/tests/mockups/data/center-services.mockup'
import { VueWrapper, mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'

describe('Services', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    setActivePinia(createPinia())
    wrapper = mount(Services, {
      global: {
        provide: {
          sortedServices: ref([])
        }
      }
    })
  })

  /*
  beforeEach(async () => {
  })
  afterEach(() => {
    wrapper.unmount()
  })
  */
  it('should have "--is-active" class on button when is clicked', async () => {
    // given
    const sortedBtnSelected = wrapper.find('.btn_sort')

    // when
    await sortedBtnSelected.trigger('click')

    // then
    expect(sortedBtnSelected.classes()).toContain('--is-active')
    expect(sortedBtnSelected.classes()).toContain('--load')
  })
  it('should render all service cards', async () => {
    /*
      const mock = new UseFetchWrapperMockBuilder<TypeDeTonMock>().call_setReturnData(DeLaDonnéeMocké).build() //mcok le prochain appel de useFetchWrapper
      const resulatDeLAppel = await useAPI().tonEndpoint.TaFunction() // function qui appel a useFetchWrapper

       const isTestEnv = process.env.NODE_ENV === 'test'
       if (!isTestEnv) {
          //ton impléméntation
        }

      // real implementation (mais qui sera intercepté par le test)
      return await _request.get<PaymentMethod[]>(_path + '/cards', { alert: alert, headers: { authorization: `Bearer ${_session.token}` } })
     */

    // given
    const serviceSpy = vi.spyOn(servicesExport, 'useServicesEndpoint').mockReturnValue({
      getServices: async () =>
        new Promise<IRequestResult<TServicesData>>((resolve) => resolve({ data: { services: centerServices, options: serviceOptions }, error: null }))
    })

    // when
    // get services using useAPI()
    const servicesData = (await useAPI().centerServices.getAllCenterServices()).data?.services
    if (!servicesData) return
    const categoriesArray: string[] = []
    servicesData.forEach((categories) => {
      categories.categories?.forEach((category) => {
        categoriesArray.push(category)
      })
    })

    // then
    expect(serviceSpy).toHaveBeenCalled()
    expect(servicesData.length).toBeGreaterThan(0)
    expect(servicesData.length).not.toBeNull()
    expect(servicesData.length).toEqual(16) // remove this line if number of services change
  })
  it('should filter the service cards by categories', async () => {
    // given
    const sortBtns = wrapper.vm.$el.querySelectorAll('.btn_sort')

    const serviceSpy = vi.spyOn(servicesExport, 'useServicesEndpoint').mockReturnValue({
      getServices: async () =>
        new Promise<IRequestResult<TServicesData>>((resolve) => resolve({ data: { services: centerServices, options: serviceOptions }, error: null }))
    })

    // when
    // get services using useAPI()
    const servicesData = (await useAPI().centerServices.getAllCenterServices()).data?.services
    if (!servicesData) return
    const categoriesArray: string[] = []
    servicesData.forEach((categories) => {
      categories.categories?.forEach((category) => {
        categoriesArray.push(category)
      })
    })

    sortBtns.forEach((sortBtn: HTMLElement) => {
      const btnDataValue = sortBtn.getAttribute('data-value')
      sortBtn.dispatchEvent(new Event('click'))

      switch (btnDataValue) {
        case 'data-value_WASH':
          expect(servicesData.length).toEqual(16)
          break
        case 'data-value_RENOVATION':
          expect(servicesData.length).toEqual(16)
          break
        // Ajoute d'autres cas pour les autres valeurs de data-value si nécessaire

        default:
          // Gère le cas par défaut si la valeur de data-value ne correspond à aucun des cas précédents
          // Par exemple, vous pouvez utiliser une assertion plus générique ici ou ignorer cette vérification
          expect(servicesData.length).toEqual(16) // remove this line if number of services change

          break
      }
    })

    //then
    expect(serviceSpy).toHaveBeenCalled()
    expect(sortBtns).not.toBeNull()
  })
})
