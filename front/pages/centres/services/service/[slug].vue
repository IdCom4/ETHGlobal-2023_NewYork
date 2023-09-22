<template>
  <main v-if="selectedService && selectedVehicleType" class="service">
    <div class="path">
      <nuxt-link to="/centres/services">Nos services&nbsp;</nuxt-link>
      <div class="path--name">/ {{ selectedService.title }}</div>
    </div>
    <section class="main-service">
      <!-- View picture (left-side) -->
      <aside class="main-service__left-side">
        <img :src="selectedService.picture" alt="" />
      </aside>

      <!-- Selected quote (right side) -->
      <aside v-if="selectedService.prices" class="main-service__right-side">
        <h4>{{ selectedService.title }}</h4>

        <!-- Select vehicles types -->
        <div class="main-service__right-side--vehicle-type">
          <!-- Vehicles type -->
          <h5>TYPE DE VÉHICULE</h5>
          <div class="selected" @click="showVehiclesTypes = !showVehiclesTypes">
            <div>{{ translatePriceKeys(selectedVehicleType) }}</div>
            <span class="largest"> {{ useEuroUnit(priceByVehicleType) }} </span>
            <fa icon="fa-solid fa-chevron-down" :class="['ic', { up: showVehiclesTypes }]" />
          </div>
          <!-- list of available vehicle type -->
          <ul :class="{ isOpen: showVehiclesTypes, isClose: !showVehiclesTypes }">
            <li v-for="(price, key) in selectedService.prices" :key="key" @click="selectVehicleType(key, price)">
              <span>{{ translatePriceKeys(key) }}</span>
              <span v-if="price">{{ useEuroUnit(price) }}</span>
            </li>
          </ul>
          <hr />
        </div>

        <!-- Informations about service -->
        <div v-if="selectedService.description" class="service-info" @click="showServiceInfo = !showServiceInfo">
          <h5 class="service-info__title">
            détails de la prestation
            <span v-if="!showServiceInfo" class="show-btn">+</span>
            <span v-else class="show-btn">-</span>
          </h5>
          <ul class="description" :class="{ isOpen: showServiceInfo, isClose: !showServiceInfo }">
            <li v-for="(describ, index) in selectedService.description" :key="index">
              - {{ describ.title }}
              <ol v-for="(step, index2) in describ.steps" :key="index2" style="margin-left: 1rem">
                {{
                  `- ${step}`
                }}
              </ol>
            </li>
          </ul>
        </div>

        <!-- List of available options with prices depending at type of vehicle selected -->
        <span v-if="optionsForSelectedVehicleType?.length !== 0">
          <div class="main-service__right-side--options">
            <div class="option-title">
              <h5>OPTIONS</h5>
            </div>
            <!-- List of options categories -->
            <ul class="category-list">
              <li
                v-for="([category, group], i) in Object.entries(groupedOptions).filter((value) => !!value[1])"
                :key="`category-${category}-${i}`"
                class="category-list__category"
              >
                <div class="category-list__category--selected" @click="toggleOptions(category)">
                  <span class="category-name">{{ category }}</span>
                  <span v-if="!group.isOpen" class="show-btn">+</span>
                  <span v-else class="show-btn">-</span>
                </div>
                <!-- list of options -->
                <ul class="category-list__category--options-list" :class="{ isOpen: group.isOpen, isClose: !group.isOpen }">
                  <!-- The option list must be updated if an option does not contain a price corresponding to the selected vehicle -->
                  <li
                    v-for="(option, j) in group.options"
                    :key="`option-${j}`"
                    :class="[
                      `options-group fadeInUp-${j}`,
                      {
                        '--visible': group.isOpen || (!!optionsSelectedState && optionsSelectedState[option.id])
                      }
                    ]"
                  >
                    <span :id="option.id" class="option-name">
                      {{ option.title }}
                    </span>
                    <div v-if="option.optionPrice">
                      <div v-if="optionsSelectedState" class="toggle">
                        <vmc-input v-model="optionsSelectedState[option.id]" type="toggle" />
                        <span class="price">{{ useEuroUnit(option.optionPrice[selectedVehicleType]) }}</span>
                      </div>
                    </div>
                    <div v-else>Prestation sur devis</div>
                  </li>
                </ul>
              </li>
            </ul>
            <hr />
          </div>
          <!-- Total price -->
          <div class="main-service__right-side--total-options-price">
            <h5>TOTAL</h5>
            <strong>{{ useEuroUnit(totalOptionsPriceToPay) }}</strong>
          </div>
        </span>
        <div v-else>
          <div class="main-service__right-side--total-options-price">
            <h5>TOTAL</h5>
            <strong>{{ useEuroUnit(totalOptionsPriceToPay) }}</strong>
          </div>
        </div>
        <button class="btn_call-to-action"><a href="tel:0161391664">RESERVEZ 01 61 39 16 64</a></button>
      </aside>

      <!-- ask for a quote -->
      <aside v-else class="main-service__right-side">
        <h4>{{ selectedService.title }}</h4>
        <div class="content">
          <h5>CONTACTEZ NOUS POUR OBTENIR UN DEVIS</h5>
          <p>
            Confiez nous votre véhicule pour tout type de prestation esthétique
          </p>
          <button class="btn_call-to-action"><a href="tel:0161391664">RESERVEZ 01 61 39 16 64</a></button>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants/stores/global-events.d'
import { CenterServiceOptionCategories } from '@/types/constants/'
import { useRoute } from 'vue-router'

/* Navbar theme */
useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'dark')

/* Get route params */
const routeSlugID = useRoute().params.slug

/* TYPES */
type TServiceOptionId = string
type TCenterServiceDetails = { isOpen: boolean; options: IServiceOption[] }
type TServiceOptionCategories = Partial<Record<CenterServiceOptionCategories, TCenterServiceDetails>>

/* Init value */
const selectedService = ref<ICenterService>()
const selectedVehicleType = ref<TVehicleType>()
const priceByVehicleType = ref<number>(0)
const optionsForSelectedVehicleType = ref<IServiceOption[]>([])
const optionsSelectedState = ref<Record<TServiceOptionId, boolean>>()
const showVehiclesTypes = ref<boolean>(false)
const showServiceInfo = ref<boolean>(true)
const groupedOptions = ref<TServiceOptionCategories>({})
let allPossibleOptions: IServiceOption[] = []

onMounted(() => {
  fetchServiceAndOptions()
})

/* Fetch service and all options */
const fetchServiceAndOptions = async () => {
  const { data } = await useAPI().centerServices.getAllCenterServices()

  if (!data) return

  const { services, options } = data

  allPossibleOptions = options

  selectedService.value = services.find((service) => service.id === routeSlugID)
  if (!selectedService.value) useRouter().push({ path: '/centres/services' })

  /* Default price vehicle type */
  selectedVehicleType.value = 'priceTTC2Seats'
  priceByVehicleType.value = selectedService.value ? selectedService.value.prices?.priceTTC2Seats ?? 0 : 0
  //TODO: What happens if "priceTTC2Seats" doesn't exist ?

  /* Set options selected state */
  const newOptionsSelectedState: Record<TServiceOptionId, boolean> = {}
  allPossibleOptions.forEach((option) => (newOptionsSelectedState[option.id] = false))
  optionsSelectedState.value = newOptionsSelectedState

  groupedOptions.value = filterGroupedOptions()
}

/* Grouped options by category */
const filterGroupedOptions = () => {
  const optionsForSelectedVehicleType = getOptionsForServiceAndVehicleType()

  const groupedOptions: TServiceOptionCategories = {}

  for (const option of optionsForSelectedVehicleType) {
    const category = option.optionCategory as CenterServiceOptionCategories

    const newGroupedOptions = groupedOptions[category]

    if (!newGroupedOptions) {
      groupedOptions[category] = { isOpen: false, options: [option] }
    } else {
      newGroupedOptions.options.push(option)
    }
  }

  return groupedOptions
}

/* Get liste of sorted options depends to type of vehicles */
const getOptionsForServiceAndVehicleType = () => {
  if (!selectedService.value || !selectedService.value.optionsIds || !selectedVehicleType.value) return []

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const vehicleType = selectedVehicleType.value!
  const serviceOptionsId = selectedService.value.optionsIds || []

  return allPossibleOptions.filter((option) => {
    const isAvailableForThisVehicleType = option.optionPrice !== undefined ? Object.keys(option.optionPrice).includes(vehicleType) : true

    const isAvailableForThisService = serviceOptionsId.includes(option.id)

    return isAvailableForThisVehicleType && isAvailableForThisService
  })
}

/* Options for service and vehicle selected */
optionsForSelectedVehicleType.value = getOptionsForServiceAndVehicleType()

/* Watch to get option's when vehicle type change */
watch(selectedVehicleType, () => {
  optionsForSelectedVehicleType.value = getOptionsForServiceAndVehicleType()
})

/* Selected type of vehicule */
const selectVehicleType = (key: TVehicleType, price?: number) => {
  showVehiclesTypes.value = false
  if (price) {
    selectedVehicleType.value = key
    priceByVehicleType.value = price
  }
  return selectedVehicleType.value
}

/* Calculate price of selected options */
const currentOptionsTotalPrices = computed(() => {
  const selectedOptions: IServiceOption[] = []
  for (const optionId in optionsSelectedState.value) {
    if (Object.prototype.hasOwnProperty.call(optionsSelectedState.value, optionId)) {
      if (!optionsSelectedState.value[optionId]) continue
      const option = allPossibleOptions.find((option) => option.id === optionId)

      if (!option) continue
      selectedOptions.push(option)
    }
  }

  const totalOptionsPrice = selectedOptions.reduce((acc, option: IServiceOption) => {
    if (!option.optionPrice) return acc

    if (selectedVehicleType.value && option.optionPrice[selectedVehicleType.value]) {
      return acc + option.optionPrice[selectedVehicleType.value]
    }

    return acc
  }, 0)

  return totalOptionsPrice
})

/* Finale price */
const totalOptionsPriceToPay = computed(() => {
  return priceByVehicleType.value + currentOptionsTotalPrices.value
})

// Open/Close dropbox of options
const toggleOptions = (category: string) => {
  if (!isCenterServiceOptionCategory(category)) return

  const groupedServiceOptions = groupedOptions.value

  const optionsGroup = groupedServiceOptions[category]

  if (optionsGroup) {
    optionsGroup.isOpen = !optionsGroup.isOpen
  }
}

function isCenterServiceOptionCategory(category: string): category is CenterServiceOptionCategories {
  const enumValues = Object.values(CenterServiceOptionCategories) as string[]
  if (!enumValues.includes(category)) return false
  return true
}

/* Translate keys of prices */
const translatePriceKeys = (key: TVehicleType) => translatedPriceKeys[key]
const translatedPriceKeys: Record<TVehicleType, string> = {
  priceTTC2Wheels: '2 Roues',
  priceTTC2Seats: '2 Places',
  priceTTC5Seats: '5 Places',
  priceTTC7Seats: '7 Places'
}
</script>

<style lang="scss" scoped>
// DESKTOP
.service {
  max-width: 1370px;
  margin: 75px auto 100px auto;
  .path {
    display: flex;
    margin-bottom: 25px;
    padding-left: 20px;
    font-family: 'Montserrat';
    font-size: 15px;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    a {
      color: #000;
      text-decoration: transparent;
      border-bottom: solid 1px #fff;
      transition: 0.3s;
      &:hover {
        border-bottom: solid 1px #000;
      }
    }
    &--name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .main-service {
    display: flex;
    margin: 0 15px;

    &__left-side {
      width: 100%;
      padding-right: 40px;
      img {
        width: 100%;
        height: 1000px;
        object-fit: cover;
      }
    }

    &__right-side {
      width: 100%;
      padding-left: 40px;

      h4 {
        display: block;
        font-size: 30px;
        font-weight: 600;
        padding: 20px 0 35px 0;
      }
      h5 {
        font-size: 17px;
        font-weight: 700;
      }
      &--vehicle-type {
        display: block;
        width: 100%;
        margin-top: 25px;
        font-family: 'Nunito';
        .selected {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 5px 0;
          cursor: pointer;
          span {
            margin-left: auto;
            margin-right: 10px;
          }
          .ic {
            transition: transform 0.3s ease;
            &.up {
              transform: rotate(-180deg);
            }
          }
        }

        ul {
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
          }
        }

        hr {
          margin: 25px 0 0 0;
        }
        .isClose {
          max-height: 0;
          overflow: hidden;
        }
        .isOpen {
          max-height: auto;
          li {
            width: 100%;
            padding: 10px 0;
            transition: 0.3s;
            &:hover {
              background-color: #e7e7e7;
            }
          }
        }
      }
      .show-btn {
        font-size: 28px;
        cursor: pointer;
      }

      &--total-options-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Nunito';
        margin: 40px 0 50px 0;
        strong {
          font-weight: bold;
          font-size: 17px;
        }
      }

      &--options {
        padding-top: 25px;
        margin: 0;
        font-family: 'Nunito';
        font-size: 16px;
        .option-title {
          width: 100%;
          display: flex;
          align-items: center;
          h5 {
            margin-top: 5px;
          }
        }
        .category-list {
          display: flex;
          flex-direction: column;
          &__category {
            display: flex;
            flex-direction: column;
            &--selected {
              display: flex;
              align-items: center;
              cursor: pointer;
              height: 65px;
              .category-name {
                font-size: 17px;
                font-weight: 600;
                width: 100%;
              }
              .show-btn {
                display: flex;
                width: auto;
              }
            }

            &--options-list {
              width: 100%;
              max-height: auto;
              @include fade-effect();

              .options-group {
                justify-content: space-between;
                display: none;

                &.--visible {
                  display: flex;
                }

                .option-name {
                  max-width: 45%;
                  font-size: 15px;
                  font-weight: 300;
                }
                .toggle {
                  display: flex;
                  align-items: center;
                  height: 22px;
                  :first-child {
                    width: auto;
                    margin-right: 10px;
                  }
                  .price {
                    width: 60px;
                    text-align: right;
                    max-width: 100%;
                    font-size: 15px;
                    font-weight: 300;
                  }
                }
              }
            }
          }

          hr {
            margin: 10px 0 0 0;
          }

          ul {
            li {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              align-items: center;
              margin-bottom: 20px;
              width: 100%;
            }
          }
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 175px;
        p {
          font-size: 16px;
          margin: 25px 0;
        }
      }

      .service-info {
        display: block;
        padding-top: 15px;
        padding: 25px 0;
        border-bottom: solid 2px #c9c9c9;
        &__title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .description {
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          gap: 10px;
          & > * {
            font-family: 'Nunito';
            font-size: 14px;
            line-height: 20px;
          }
          &.isClose {
            margin-top: 0;
            max-height: 0;
            overflow: hidden;
          }
          &.isOpen {
            margin-top: 15px;
            max-height: auto;
            transition: 0.3s;
          }
        }
      }
    }

    .btn_call-to-action {
      margin: 0;
      a {
        color: black;
      }
    }
  }
}

// DEVICE 900px
// @media screen and (max-width: 900px) {
//   .service {
//     .main-service {
//       &__right-side {
//         &--options {
//           .category-list {
//             &__category {
//               &--options-list {
//                 text-align: left;
//                 .options-group {
//                   flex-direction: column;
//                   align-items: flex-start;
//                   margin-bottom: 25px;
//                   .option-name {
//                     max-width: 100%;
//                     margin-bottom: 10px;
//                   }
//                   // .toggle {
//                   //   width: 90vw;
//                   //   justify-content: space-between;
//                   // }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

// MOBILE
@media screen and (max-width: 870px) {
  .service {
    margin: auto;
    padding: 50px 20px;
    .path {
      padding: 0;
    }
    .main-service {
      flex-direction: column;
      margin: 0;
      &__left-side {
        width: 100%;
        padding-right: 0;
        img {
          max-height: 295px;
        }
      }
      &__right-side {
        padding: 0;
        h4 {
          font-size: 26px;
        }

        &--vehicle-type {
          margin: 0;
          margin-top: 25px;
        }

        &--options {
          .category-list {
            &__category {
              &--options-list {
                text-align: left;
                // .options-group {
                //   flex-direction: column;
                //   align-items: flex-start;
                //   margin-bottom: 25px;
                //   .option-name {
                //     max-width: 100%;
                //     margin-bottom: 10px;
                //   }
                //   .toggle {
                //     width: 90vw;
                //     justify-content: space-between;
                //   }
                // }
              }
            }
          }
        }

        &--total-options-price {
          margin: 30px 0 50px 0;
        }
      }
    }
  }
}

@media screen and (max-width: 490px) {
  .service {
    .main-service {
      &__right-side {
        &--options {
          .category-list {
            &__category {
              &--options-list {
                .options-group {
                  flex-direction: column;
                  align-items: flex-start;
                  margin-bottom: 25px;
                  .option-name {
                    max-width: 100%;
                    margin-bottom: 10px;
                  }
                  .toggle {
                    width: 88vw;
                    justify-content: space-between;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
