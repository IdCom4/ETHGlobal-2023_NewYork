<template>
  <section ref="printableContent" class="quote-sended-sum">
    <div v-if="isInvoice">
      <div class="invoice-header">
        <h2 class="--var-bottom small-bottom">{{ companyName }}</h2>
        <Fa icon="fa-solid fa-print" class="print-icon" title="Imprimer la facture" @click="printPage" />
      </div>
      <h4>Facture n°{{ mission.invoiceId }}</h4>
    </div>

    <div :class="{ 'receiver-spacing': isInvoice }">
      <p v-if="isInvoice" class="largest">Destinataire</p>
      <p v-else class="largest">Devis à destination de</p>
      <h4>
        <span class="first-name">{{ client.name }}</span> {{ `${client.lastName}` }}
      </h4>
      <p class="largest bold">{{ addressToString(idealPickupAddress) }}</p>
    </div>
    <div style="margin-bottom: 30px;">
      <h4>Véhicule pris en charge</h4>
      <p class="largest">{{ `${vehicle.brand} ${vehicle.model} | ${vehicle.plate}` }}</p>
    </div>

    <div v-if="!isInvoice && professionalProposal">
      <h4>Lieu de prise en charge</h4>
      <p class="largest">{{ addressToString(professionalProposal.pickupAddress) }}</p>
    </div>
    <div v-if="!isInvoice && professionalProposal" style="margin-bottom: 30px;">
      <h4>Date et heure</h4>
      <p class="largest">{{ dateUtils.formatStrDate(professionalProposal.startDate, 'dd/MM/yyyy HH:mm', 'dd/MM à HH:mm') }}</p>
    </div>

    <div v-if="isInvoice">
      <h4>Kilométrage du véhicule</h4>
      <p class="largest">{{ vehicle.mileage }} km</p>
    </div>

    <div class="consumables-pieces-workforce">
      <div v-for="(quoteCategoryObj, key) in quoteItemsCategory" :key="`quote-sended-sum-${key}`">
        <h4>{{ quoteCategoryObj.sectionName }}</h4>

        <ul class="quote-items-container">
          <li v-for="(quoteItem, index) in quoteCategoryObj.value" :key="`quote-category-obj-${index}`" class="flex-item">
            <p class="largest">{{ quoteItem.description }}</p>
            <p class="largest">{{ useEuroUnit(quoteItem.quantity * quoteItem.unitPriceHT) }}</p>
          </li>
        </ul>
      </div>

      <div class="total-sum">
        <div class="ht-sum flex-item">
          <h4>Total HT</h4>
          <p class="largest">{{ useEuroUnit(totalHT) }}</p>
        </div>

        <div class="ttc-sum" :class="{ 'invoice-sum': isInvoice }">
          <div class="flex-item">
            <h4>TVA</h4>
            <p class="largest">{{ useEuroUnit(tva) }}</p>
          </div>

          <div class="flex-item">
            <h4>Total TTC</h4>
            <p class="largest ttc-blue">{{ useEuroUnit(totalTTC) }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-if="isUpdatable" class="largest automobilist-message">
      {{ bottomText }}
    </p>
    <div v-if="!isUpdatable && !isInvoice && !isProfessional" class="flex-buttons">
      <button class="btn_denied --white-font" :class="{ '--load': loadingButton.decline }" @click="declineQuote">Declinez</button>
      <button class="btn_call-to-action" :class="{ '--load': loadingButton.accept }" @click="acceptQuote">Acceptez le devis</button>
    </div>
    <div v-if="!isUpdatable && !isInvoice && isProfessional" class="flex-buttons">
      <!-- <button class="btn_denied --white-font" :class="{ '--load': loadingButton.decline }" @click="cancelQuote">Annulez</button> -->
      <button class="btn_call-to-action" :class="{ '--load': loadingButton.accept }" @click="modifyQuote">Modifiez</button>
    </div>
    <p v-if="!isUpdatable && !isInvoice && !isProfessional" class="availability-time">
      Votre devis est disponible encore
      <span>{{ convertMillisecondsToTimeString(remainingTime) }}</span>
    </p>
  </section>
</template>
<script setup lang="ts">
import { MissionStatuses } from '~~/assets/ts/enums'

const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  professionalEntry: { type: Object as PropType<IMissionProfessionalEntry>, required: true }
})

type TQuoteSections = Array<{ sectionName: string; value: IMissionQuoteProduct[] }>
const printableContent = ref<HTMLElement | null>(null)

const dateUtils = useUtils().dates

const _48HoursInMs = 172800
const isUpdatable = ref<boolean>(props.mission.status === MissionStatuses.QUOTE_PENDING)
const isInvoice = ref<boolean>(props.mission.status === MissionStatuses.DELIVERED)
const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)
const vehicle = ref<IGuestVehicle>(props.mission.clientRequest.vehicle)
const client = ref<ILiteUser>(props.mission.clientRequest.client)
const idealPickupAddress = ref<IAddress>(props.mission.clientRequest.idealPickupAddress)
const professionalProposal = ref<IMissionProfessionalProposal | null>(props.professionalEntry.proposal || null)
const professionalId = ref<string>(props.professionalEntry.professional._id)
const companyName = ref<string>(props.professionalEntry.professional.professionalProfile.businessName)
const quoteItemsCategory = ref<TQuoteSections>([])
const loadingButton = ref({ accept: false, decline: false })

const bottomText = isProfessional.value
  ? 'Nous vous invitons à prendre contact avec votre client via la messagerie si vous souhaitez ajuster les lieux et horaires de prise en charge du véhicule.'
  : 'Nous vous invitons à prendre contact avec votre client via la messagerie si vous souhaitez ajuster les lieux et horaires de prise en charge du véhicule.'

const totalHT = computed<number>(() => {
  return quoteItemsCategory.value.reduce(
    (accumulator: number, currentValue) =>
      accumulator + currentValue.value.reduce((subAccumulator: number, product) => subAccumulator + product.quantity * product.unitPriceHT, 0),
    0
  )
})

const totalTTC = computed<number>(() => totalHT.value * (1 + (professionalProposal.value?.quote.tvaRate || 0) * 0.01))
const tva = computed<number>(() => (professionalProposal.value?.quote.tvaRate || 0) * 0.01 * totalHT.value)
const remainingTime = computed<number>(() => {
  if (!props.mission.finishedAt) return 48 * 3600 * 1000
  const limitTime = Date.now() + _48HoursInMs
  const quoteSentAtDate = useUtils().dates.getDateFromStr(props.mission.finishedAt)
  const quoteSentAtTime = quoteSentAtDate ? quoteSentAtDate.getTime() : 0
  return limitTime - quoteSentAtTime
})

watch(
  () => props.mission,
  () => {
    client.value = props.mission.clientRequest.client
    vehicle.value = props.mission.clientRequest.vehicle
    idealPickupAddress.value = props.mission.clientRequest.idealPickupAddress
  }
)

watch(
  () => professionalProposal.value,
  () => {
    quoteItemsCategory.value = [
      { sectionName: "Main d'oeuvre", value: professionalProposal.value?.quote.workForces || [] },
      { sectionName: 'Pièces et Produits', value: professionalProposal.value?.quote.consumables || [] },
      { sectionName: 'Location et équipements', value: professionalProposal.value?.quote.placeAndEquipments || [] }
    ].filter((itemObj) => itemObj.value.length > 0)
  },
  { immediate: true }
)

function addressToString(address?: IAddress) {
  if (!address) return
  return `${address.street}, ${address.zipCode} ${address.city}`
}

const convertMillisecondsToTimeString = (millisecond: number): string => {
  return millisecond > 3600000 ? `${Math.round(millisecond / 3600000)} h` : `${Math.round(millisecond / 60000)} min`
}

function acceptQuote() {
  useRouter().push(`/plateforme/automobiliste/mes-demandes/paiement/${props.mission._id}/${professionalId.value}`)
}

function declineQuote() {
  useRouter().push(`/plateforme/automobiliste/mes-demandes/refus/${props.mission._id}/${professionalId.value}`)
}

function modifyQuote() {
  useRouter().push(`/plateforme/specialiste/outil-devis/${props.mission._id}`)
}

function printPage() {
  // use PDF file from the API
  window.print()
}
</script>
<style scoped lang="scss">
.quote-sended-sum {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  background-color: white;
  color: black;
  padding: 20px;
  .receiver-spacing {
    margin-bottom: 30px;
  }

  .invoice-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 30px;
    margin-bottom: 2rem;
    .print-icon {
      cursor: pointer;
    }
  }

  h4 {
    font-weight: 700;
  }

  .bold {
    font-weight: 700;
    &.italic {
      font-style: italic;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .first-name {
    text-transform: capitalize;
    font-size: unset;
    font-family: unset;
    font-weight: unset;
  }

  .flex-buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
  }

  .availability-time {
    justify-self: center;
    align-self: center;

    > span {
      font-weight: bold;
    }
  }
  .consumables-pieces-workforce {
    display: flex;
    gap: 50px;
    h4 {
      margin-bottom: 10px;
    }

    .quote-items-container {
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background-color: $color-light-grey;
    }
  }
  .automobilist-message {
    text-align: center;
    padding: 0px 70px;
    margin-bottom: 30px;
  }
}

.flex-item {
  display: flex;
  justify-content: space-between;

  .ttc-blue {
    color: $color-neon-blue;
  }
}
.total-sum {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: flex-end;
  width: 100%;
  max-width: 310px;

  .ht-sum {
    padding: 0px 15px;
  }

  .ttc-sum {
    background-color: $color-dark-blue;
    color: $white;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    justify-content: center;
    &.invoice-sum {
      background-color: $color-light-grey;
      color: $black;
      .ttc-blue {
        color: black;
      }
    }
  }
}
</style>
