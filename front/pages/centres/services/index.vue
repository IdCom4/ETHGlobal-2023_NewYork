<template>
  <main class="services-center">
    <section class="all-services">
      <div class="title">
        <vmc-header text="NOS SERVICES" />
        <p>
          Formé sur toutes les gammes de véhicules y compris de collection, ValueMyCar offre une large gamme de services esthétiques, du lavage au Car
          Staging en passant par le polissage et la suppression de rayures.
        </p>
      </div>
      <ul class="quick-sort">
        <li
          v-for="(category, index) in categoriesState.categories"
          :key="`category ${index}`"
          :title="`Trier par ${getTranslatedCategoryName(category)}`"
          class="quick-sort__tag-sort"
          :class="{ '--is-active': activeIndex === index }"
          @click="handleServices(category, index)"
        >
          <button
            class="btn_sort"
            :class="{ '--is-active': activeIndex === index, '--load': isLoading[index] }"
            :data-value="`data-value_${category}`"
          >
            {{ getTranslatedCategoryName(category) }}
          </button>
        </li>
      </ul>
      <div class="services-container">
        <div class="services-wrapper">
          <center-service-card
            v-for="(centerService, i) in sortedServices"
            :id="centerService.id"
            :key="`service_${i}`"
            :title="centerService.title"
            :subtitle="centerService.subtitle"
            :picture="centerService.picture"
            :description="centerService.description"
            :min-price="centerService.prices?.priceTTC2Seats"
            :best-sale="centerService.isBestSale"
            :is-loading="isSkeletonLoading"
            theme="light"
          />
        </div>
      </div>
    </section>
    <!-- <section class="custom-service">
      <div class="left-side">
        <div class="title">
          <h2 class="--var-bottom">NOS SERVICES PERSONNALISÉS</h2>
        </div>
      </div>
    </section> -->
  </main>
</template>

<script lang="ts">
interface ICategories {
  categories: string[]
}
</script>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'dark')
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'dark')
})

const categoriesState: ICategories = reactive({
  categories: []
})
const activeIndex = ref(0)
const isLoading = ref(categoriesState.categories.map(() => false))
const isSkeletonLoading = ref<boolean>(false)
const sortedServices: Ref<IFrontOnlyCenterService[]> = ref([])
const allServices: Ref<IFrontOnlyCenterService[]> = ref([])

onMounted(() => {
  handleServices('BEST_SALE', 0)
})

/* Fetch services */
const fetchServices = async () => {
  const { data } = await useAPI().centerServices.getAllCenterServices()
  if (!data) return

  const { services } = data

  allServices.value = setIsBestSale(services, 3)

  sortByBestSales(allServices.value)
  getCategories(allServices.value)
}

fetchServices()

const setIsBestSale = (services: ICenterService[], numberOfBestSale: number): IFrontOnlyCenterService[] => {
  const castServices: IFrontOnlyCenterService[] = services.map((service) => ({ ...service, isBestSale: false }))

  const sortedServices = castServices.sort((a, b) => b.numberOfSales - a.numberOfSales)

  for (let i = 0; i < numberOfBestSale && i < sortedServices.length; i++) sortedServices[i].isBestSale = true
  return sortedServices
}

/* Global handle services function */
const handleServices = (category: string, index: number) => {
  isLoading.value.fill(false)
  isLoading.value[index] = true

  isSkeletonLoading.value = true
  activeIndex.value = index

  isLoading.value[index] = false
  isSkeletonLoading.value = false

  sortServices(category)
}

/* Sorted service by categorires */
const sortServices = (category: string) => {
  switch (category) {
    case 'BEST_SALE':
      sortByBestSales(allServices.value)
      break
    case 'WASH':
      sortedServices.value = allServices.value.filter((service) => service.serviceCategories && service.serviceCategories.includes('WASH'))
      break
    case 'DETAILING':
      sortedServices.value = allServices.value.filter((service) => service.serviceCategories && service.serviceCategories.includes('DETAILING'))
      break
    case 'RENOVATION':
      sortedServices.value = allServices.value.filter((service) => service.serviceCategories && service.serviceCategories.includes('RENOVATION'))
      break
    case 'OTHER':
      sortedServices.value = allServices.value.filter((service) => service.serviceCategories && service.serviceCategories.includes('OTHER'))
      break
    default:
      sortedServices.value = allServices.value
      break
  }
}

/* find services with the highest number of sales */
const sortByBestSales = (services: IFrontOnlyCenterService[]): void => {
  sortedServices.value = services.sort((a, b) => b.numberOfSales - a.numberOfSales)
}

/* Get categories of services */
const getCategories = (services: IFrontOnlyCenterService[]): void => {
  services.forEach((service) => {
    if (!service.serviceCategories) return
    service.serviceCategories.forEach((category) => {
      if (!categoriesState.categories.includes(category)) {
        categoriesState.categories.push(category)
      }
    })
  })
  categoriesState.categories.unshift('BEST_SALE')
}

// Translate categories names
const getTranslatedCategoryName = (category: string): string => {
  switch (category) {
    case 'WASH':
      return 'Lavage'
    case 'RENOVATION':
      return 'Rénovation'
    case 'DETAILING':
      return 'Detailing'
    case 'OTHER':
      return 'Autres'
    case 'BEST_SALE':
      return 'Top vente'
    default:
      return category
  }
}
</script>

<style lang="scss">
.services-center {
  .all-services {
    padding: 0 20px;
    margin: auto;
    overflow: visible;
    max-width: 1220px;
    min-height: 750px;
    z-index: 0;
    .title {
      margin: 25px 0;
      h2 {
        margin: 0;
        font-size: 28px;
      }
      p {
        width: 66%;
        margin: 40px 0 45px 0;
        font-size: 18px;
        font-weight: 400;
        line-height: 22px;
      }
    }
    .quick-sort {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      row-gap: 1px;
      &__tag-sort {
        transition: 0.3s;
        &:hover {
          background-color: #e7e7e7;
        }
        &.--is-active {
          background-color: #000;
          button {
            color: #fff;
          }
        }
        button {
          width: 100%;
          min-width: 100px;
        }
      }
    }
    .services-container {
      display: flex;
      justify-content: center;
    }
    .services-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      margin: auto;
      align-items: center;
      overflow: hidden;
    }
  }
}
.custom-service {
  display: flex;
  width: 100vw;
  .left-side {
    width: 50%;
    padding: 50px 150px;
    background-color: $color-dark-blue;
    .title {
      margin: 5vw 0;
      h2 {
        width: 350px;
        margin: 0;
        color: #fff;
      }
    }
    p {
      width: auto;
      margin-bottom: 7vw;
      line-height: 25px;
      font-family: 'Nunito';
      font-size: 19px;
      color: #fff;
    }
  }
  .right-side {
    width: 50%;
    .img-custom-service {
      width: 100%;
      height: fit-content;
    }
  }
}
.custom-service-mobile {
  display: none;
}

/* MOBILE */
@media (max-width: 1210px) {
  .services-center {
    .all-services {
      .title {
        p {
          width: 100%;
        }
      }
    }
    .custom-service {
      display: none;
    }
    .custom-service-mobile {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: $color-dark-blue;
      padding: 10px;
      box-shadow: 0 -5px 10px 5px #0000006b;
      z-index: 99;
      h4 {
        color: #fff;
        font-size: 11px;
        margin-right: 5%;
      }
      button {
        width: 50%;
        font-size: 9px;
        max-width: 335px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .services-center {
    .all-services {
      .title {
        padding: 0 !important;
      }
    }
  }
}
</style>
