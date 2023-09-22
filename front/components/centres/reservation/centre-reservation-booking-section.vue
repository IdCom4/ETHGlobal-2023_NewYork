<template>
  <section id="main">
    <vmc-modal :is-open="bookingModalOpen" max-width="500px" @close="bookingModalOpen = false">
      <booking-calendar
        v-model="form.selectedDay"
        :selected-formula="selectedFormula"
        :selected-box-category="selectedBox"
        :center-id="centerId"
        @close="bookingModalOpen = false"
      />
    </vmc-modal>
    <vmc-modal :is-open="paymentModalOpen" max-width="500px" @close="paymentModalOpen = false">
      <credit-card-select v-model="selectedCreditCard" />
      <card-payment-interface v-if="!selectedCreditCard" :amount="TTPriceFinal" @submit-function-loaded="onSubmitFunctionLoaded" />
      <div class="reservation-total">
        <h4>TOTAL TTC</h4>
        <h4>{{ TTPriceFinal.toFixed(2) }} €</h4>
      </div>
      <div class="btn-row">
        <button class="btn_call-to-action" :class="{ '--load': isLoadingBookingConfirm }" @click="payAndConfirmBooking">Reserver</button>
        <button class="btn_denied" @click="paymentModalOpen = false">Annuler</button>
      </div>
    </vmc-modal>
    <div class="title">
      <div class="container">
        <h2>RESERVEZ VOTRE BOX</h2>
        <div class="vertical-separator">
          <div class="bold"></div>
          <div class="thin"></div>
        </div>
      </div>
    </div>
    <p>
      Choisissez votre box en fonction de vos besoins spécifiques et profitez de l'espace et de l'équipement dont vous avez besoin pour travailler sur
      votre voiture. Deux méthodes de réservations sont disponibles :
    </p>
    <div id="box-container">
      <div id="left-half">
        <div class="box">
          <span class="contact">EN LIGNE</span>
          <vmc-input v-model="selectedBox" label="TYPE DE BOX" type="select" :select-options="boxTypes" />
          <vmc-input v-model="selectedFormula" label="FORMULE" type="select" :select-options="formulasOptions" />
          <vmc-input
            :error="formValidator.getErrorsOf('selectedDay')[0]"
            label="DATE DE RESERVATION"
            type="text"
            :model-value="selectedDayStr"
            readonly
            @click="bookingModalOpen = true"
            @input="formValidator.validateOne('selectedDay')"
          />
          <vmc-input
            v-model="form.selectedTime"
            :error="formValidator.getErrorsOf('selectedTime')[0]"
            label="HEURE DE DEBUT"
            type="select"
            :select-options="timesAvailable"
            @input="formValidator.validateOne('selectedTime')"
          />
          <promo-code @valid="(newValue: IPromoCode) => (promoData = newValue)" />

          <div class="total">
            <div v-if="promoData && promoData.reductionPercentage !== 0" class="reduction">
              <h4>CODE PROMO</h4>
              <h4>-{{ promoData?.reductionPercentage }} %</h4>
            </div>
            <div>
              <h4>TOTAL TTC</h4>
              <h4>{{ TTPriceFinal.toFixed(2) }} €</h4>
            </div>
          </div>
          <button v-if="isLoggedIn" class="booking-btn btn_call-to-action" @click="paymentModalOpen = true">
            RÉSERVEZ
          </button>
          <div v-else>
            <button class="booking-btn btn_call-to-action" @click="openLoginModal">RÉSERVEZ</button>
          </div>
        </div>

        <div class="box">
          <span class="contact">INFORMATIONS COMPLÉMENTAIRES</span>
          <collapsable-section title="EQUIPEMENTS">
            <div class="list-content">
              <li v-for="information in equipmentBoxInformation" :key="information">
                <span>{{ information }}</span>
              </li>
            </div>
          </collapsable-section>
          <collapsable-section title="PRESTATIONS RÉALISABLES">
            <div class="list-content">
              <li v-for="information in prestationBoxInformation" :key="information">
                <span>{{ information }}</span>
              </li>
            </div>
          </collapsable-section>
          <collapsable-section title="CONDITIONS D'ANNULATION">
            Annulation possible jusqu'à 24 heures avant le début de la réservation
          </collapsable-section>
          <collapsable-section title="UN ACCOMPAGNEMENT INDIVIDUALISÉ">
            Un membre de notre équipe à votre écoute pour vous accompagner et vous apporter les conseils nécessaires
          </collapsable-section>
        </div>
      </div>
      <div id="right-half">
        <div class="box">
          <span class="contact">PAR TÉLÉPHONE</span>
          <p>
            Appelez le centre automobile ValueMyCar<br />
            <a
              href="https://www.google.com/search?q=valuemycar+rambouillet&oq=valuemycar+rambo&aqs=chrome.0.69i59j69i57j69i60l2j69i65j69i60.1688j0j1&sourceid=chrome&ie=UTF-8"
              >3 rue Hélène Boucher, 78125 Gazeran</a
            >
          </p>
          <a href="tel:+33161391664"><button class="btn_call-to-action">01 61 39 16 64</button></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { GlobalEventTypes, AlertStatuses } from '@/types/constants'
import {
  detailingBoxEquipments,
  detailingBoxPrestations,
  washBoxEquipments,
  washBoxPrestations,
  mecaBoxEquipments,
  mecaBoxPrestations
} from '@/assets/json/centres/reservation'
import { FormValidator } from '@/composables/useValidator'

interface IBookingForm {
  selectedDay?: IDateAvailability
  selectedTime?: string
}

const form = reactive<IBookingForm>({
  selectedDay: undefined,
  selectedTime: undefined
})

const formValidator = reactive<FormValidator<IBookingForm>>(
  useValidator().createFormValidator<IBookingForm>({
    selectedDay: {
      getter: () => form.selectedDay,
      validate: (selectedDay?: IDateAvailability) => (selectedDay ? [] : ['Veuillez choisir une date de réservation'])
    },
    selectedTime: {
      getter: () => form.selectedTime,
      validate: (selectedTime?: string) => (selectedTime ? [] : ['Veuillez choisir un horaire de réservation'])
    }
  })
)

const selectedBox = ref<TBoxCategory>()
const selectedFormula = ref<IFormula>()
const boxesFormulas = ref<TBoxCategoriesFormulas>()

const boxTypes = ref<IInputSelectOptions<TBoxCategory>[]>([])
const promoData = ref<IPromoCode>()
const selectedCreditCard = ref<ICreditCard>()
const isLoadingBookingConfirm = ref<boolean>(false)
const centerId = ref<string>('')

const route = useRoute()
const currentBox = route.params.boxType

const bookingModalOpen = ref<boolean>(false)
const paymentModalOpen = ref<boolean>(false)

let cardSubmitFunction: TPaymentSubmitFunction

const isLoggedIn = ref<boolean>(useSessionStore().isLoggedIn)

const TTPrice = computed<number>(() => selectedFormula.value?.price || 0)
const TTPriceFinal = computed<number>(() => TTPrice.value * (1 - (promoData.value?.reductionPercentage || 0) * 0.01))

const selectedDayStr = computed<string>(() => (form.selectedDay ? useUtils().dates.getStrFromDate(form.selectedDay.date, 'dd/MM/yyyy') : ''))

const formulasOptions = computed<IInputSelectOptions<IFormula>[]>(() => {
  if (!selectedBox.value) return []
  if (!boxesFormulas.value) return []
  return boxesFormulas.value[selectedBox.value].map((formula: IFormula) => ({
    value: formula,
    display: `${formula.label} - ${formula.price} €`
  }))
})

const timesAvailable = computed<IInputSelectOptions<string>[]>(() => {
  if (!form.selectedDay) return []
  const entries = Object.entries(form.selectedDay.availability)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([time, available]) => available === true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([time, available]) => {
      return {
        display: time,
        value: time
      }
    })

  return entries
})

const equipmentBoxInformation = computed<string[]>(() => {
  switch (selectedBox.value) {
    case 'DETAILINGBOX':
      return detailingBoxEquipments
    case 'MECABOX':
      return mecaBoxEquipments
    case 'WASHBOX':
      return washBoxEquipments
    default:
      return []
  }
})

const prestationBoxInformation = computed<string[]>(() => {
  switch (selectedBox.value) {
    case 'DETAILINGBOX':
      return detailingBoxPrestations
    case 'MECABOX':
      return mecaBoxPrestations
    case 'WASHBOX':
      return washBoxPrestations
    default:
      return []
  }
})

getCenterId()

watch(centerId, getBoxSelectOptions)

watch([selectedBox, selectedFormula], () => {
  form.selectedDay = undefined
  form.selectedTime = undefined
})

watch(
  () => useSessionStore().isLoggedIn,
  (newLogState) => (isLoggedIn.value = newLogState)
)

async function getCenterId() {
  const centers = await useAPI().centers.getCenters()
  if (!centers.data) return

  centerId.value = centers.data[0]._id
}

async function getBoxSelectOptions() {
  const { data: fetchedBoxFormulas } = await useAPI().centers.getCenterFormulas(centerId.value)
  if (!fetchedBoxFormulas) return
  boxesFormulas.value = fetchedBoxFormulas

  const categoriesTranslations: Record<TBoxCategory, string> = {
    DETAILINGBOX: 'Esthétique',
    MECABOX: 'Mécanique',
    WASHBOX: 'Lavage'
  }

  boxTypes.value = Object.keys(fetchedBoxFormulas).map((boxType) => ({
    value: boxType as TBoxCategory,
    display: categoriesTranslations[boxType as TBoxCategory]
  }))

  if (!currentBox || typeof currentBox !== 'string') return

  selectedBox.value = currentBox as TBoxCategory
}

function onSubmitFunctionLoaded(submitFunction: TPaymentSubmitFunction) {
  cardSubmitFunction = submitFunction
}

function openLoginModal() {
  useGlobalEvents().emitEvent(GlobalEventTypes.OPEN_LOGIN)
}

async function payAndConfirmBooking() {
  if (!formValidator.validateForm() || !selectedFormula.value || !selectedBox.value) {
    useAlertStore().sendAlert(
      AlertStatuses.ERROR,
      formValidator.hasAnyErrors() ? 'Certaines informations sont incorrectes' : 'Une erreur inconnue est survenue'
    )
    paymentModalOpen.value = false
    return
  }

  isLoadingBookingConfirm.value = true

  const response = await useAPI().bookings.createNewBooking(
    {
      boxCategory: selectedBox.value,
      centerId: centerId.value,
      startingDay: selectedDayStr.value,
      beginHour: form.selectedTime || '',
      formula: selectedFormula.value,
      creditCardId: selectedCreditCard.value?.id || '',
      promoCodeLabel: promoData.value?.label
    },
    cardSubmitFunction
  )

  isLoadingBookingConfirm.value = false
  if (response.error) return
  if (!response.data) return

  navigateTo(`/centres/reservation/${selectedBox.value}/confirmation`)
}
</script>

<style lang="scss" scoped>
.btn-row {
  justify-content: space-around;
  display: flex;
  gap: 10px;
  margin-top: 15px;

  > button {
    width: 100%;
  }
}

.reservation-total {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 20px 0px;
}

#main {
  padding: 70px 275px;
  a {
    color: black;
  }

  .title {
    display: inline-block;
    .container {
      display: inline-block;
      h2 {
        font-family: 'Montserrat';
        font-style: italic;
        font-weight: 800;
        font-size: 28px;
        line-height: 34px;
      }
    }

    .vertical-separator {
      width: 75%;
      margin: 20px 0 20px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      .bold {
        height: 3px;
        width: 33%;
        background-color: black;
      }
      .thin {
        height: 1px;
        width: 66%;
        background-color: black;
      }
    }
  }
  p {
    margin-top: 20px;
    margin-bottom: 20px;

    max-width: 599px;

    font-family: 'Nunito';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
  }

  .list-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  #box-container {
    display: flex;
    flex-direction: row;
    gap: 6px;

    div {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.connection {
        display: flex;
        justify-content: center;
        flex-direction: row;
      }
    }
    #left-half {
      width: 50%;
    }
    #right-half {
      width: 50%;
    }

    .box {
      border: 1px solid black;
      padding: 40px;

      .contact {
        margin-bottom: 20px;
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 32px;
      }
      .total {
        gap: 0px;
        margin: 10px 0px;
        margin-top: 20px;

        > div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          &:not(:first-child) {
            margin-top: 20px;
          }
        }
      }

      .booking-btn {
        margin-top: 30px;
        width: 100%;
      }

      p {
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 25px;

        margin-top: 0px;
        margin-bottom: 25px;
        width: unset;
        height: unset;

        a {
          text-decoration: underline;
        }
      }
      .link-container {
        border-bottom: 1px solid black;
        margin-bottom: 20px;
        cursor: pointer;
        .text {
          position: relative;
          margin-bottom: 40px;

          span {
            font-family: 'Nunito';
            font-style: normal;
            font-weight: 400;
            font-size: 22px;
            line-height: 30px;
          }
          svg {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto 0;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  #main {
    padding: 70px 5vw;
  }
}
@media screen and (max-width: 900px) {
  #main {
    p {
      font-size: 12px;
      line-height: 20px;
    }
    .title {
      .container {
        h2 {
          font-size: 22px;
        }
      }
    }
    padding: 70px 20px;
    #box-container {
      flex-direction: column-reverse;
      .box {
        padding: 20px;
        .contact {
          font-size: 16px;
          line-height: 20px;

          margin-bottom: 10px;
        }
        p {
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 15px;
        }
        .total {
          span {
            font-size: 16px;
          }
        }
        .link-container {
          .text {
            span {
              font-size: 12px;
              line-height: 16px;
            }
          }
        }
      }
      #left-half {
        width: 100%;
      }

      #right-half {
        width: 100%;
      }
    }
  }
}
</style>
