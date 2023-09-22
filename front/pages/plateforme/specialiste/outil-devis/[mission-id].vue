<template>
  <div>
    <client-banner v-if="mission" :client-request="mission.clientRequest" />
    <section class="quote-container">
      <mission-quote-client-recipient v-if="mission" mobile :client-request="mission.clientRequest" class="mobile" />
      <mission-quote-notepad v-model="privateNote" class="simple-block" @blur="updatePrivateNote" />
      <div class="mains-sections">
        <div>
          <!-- WORKFORCES -->
          <mission-quote-products-list-input
            v-model="workforces"
            category="main d'oeuvre"
            :labels="{ description: 'Opération éffectuée', quantity: 'Durée (en heure)', unitPriceHT: 'Taux Horaire' }"
            class="section-block"
          />

          <!-- CONSUMABLES -->
          <mission-quote-products-list-input
            v-model="consumables"
            category="pièces et produits"
            :labels="{ description: 'Consommable', quantity: 'Quantité', unitPriceHT: 'Prix unitaire' }"
            optional
            class="section-block"
          />

          <!-- PLACE AND EQUIPMENTS -->
          <mission-quote-products-list-input
            v-model="placeAndEquipments"
            category="location lieux et materiels"
            :labels="{ description: 'Lieu ou matériel', quantity: 'Durée (en heure)', unitPriceHT: 'Taux Horaire' }"
            optional
            class="section-block"
          />

          <!-- TIME AND PLACE -->
          <mission-quote-location-date-input v-model="dateAndAddress" class="section-block" />
        </div>
        <div class="right-wrapper">
          <mission-quote-client-recipient v-if="mission" :client-request="mission.clientRequest" class="section-block desktop" />
          <div class="section-block quote-summary">
            <h3 class="top-bottom">Synthèse du devis</h3>
            <mission-quote-modality :start-date="dateAndAddress.date" :address="dateAndAddress.address" />
            <mission-quote-summary
              v-model:tva-rate="tvaRate"
              :is-quote-update-loading="quoteUpdateLoading"
              :workforces="workforces"
              :consumables="consumables"
              :rental="placeAndEquipments"
              @submit-quote="sendQuote"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { IMissionProposalPayload } from '@/composables/resources/api-endpoints/missions.endpoint'
import { AlertModes, AlertStatuses, GlobalEventTypes } from '@/types/constants'

definePageMeta({ middleware: ['is-professional'] })

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'dark')
})

const route = useRoute()

let initialProposal: IMissionProfessionalProposal | null = null
const mission = ref<IPopulatedProfessionalMission | null>(null)
const privateNote = ref<string>('')
const workforces = ref<IMissionQuoteProduct[]>([])
const consumables = ref<IMissionQuoteProduct[]>([])
const placeAndEquipments = ref<IMissionQuoteProduct[]>([])
const quoteUpdateLoading = ref<boolean>(false)
const tvaRate = ref<number>(0)
const dateAndAddress = ref<IDateAndAddress>({
  date: undefined,
  address: undefined
})

onBeforeMount(async () => {
  const missionId = route.params['missionid'] as string
  await fetchMission(missionId)
  setVariables()
})

async function fetchMission(missionId: string) {
  const missionReponse = await useAPI().missions.getProfessionalMissionById(missionId)
  if (!missionReponse.data || missionReponse.error) {
    useRouter().push('/plateforme/specialiste/mes-missions')
    return
  }

  const issueReponse = await useAPI().issues.getIssuesByIds(missionReponse.data.clientRequest.issueIds)
  if (!issueReponse.data || issueReponse.error) return

  mission.value = useUtils().missions.populateMissions<IPopulatedProfessionalMission>([missionReponse.data], issueReponse.data)[0]
}

function setVariables() {
  if (!mission.value) return

  const [professionalEntry] = mission.value.professionalEntries

  privateNote.value = professionalEntry.privateNote || ''

  initialProposal = professionalEntry.proposal || null
  if (!initialProposal) return

  dateAndAddress.value.address = initialProposal.pickupAddress
  dateAndAddress.value.date = useUtils().dates.getDateFromStr(initialProposal.startDate) || undefined

  const quote = initialProposal.quote
  if (!quote) return

  tvaRate.value = quote.tvaRate
  workforces.value = quote.workForces
  consumables.value = quote.consumables
  placeAndEquipments.value = quote.placeAndEquipments
}

function buildMissionProposalPayload(): IMissionProposalPayload | null {
  // check for mission quote
  if (!workforces.value.length && !consumables.value.length) {
    useAlertStore().sendAlert(AlertStatuses.ERROR, "Vous devez renseigner au moins une opération de main d'oeuvre ou une pièce/produit")

    return null
  }

  // check for mission modalities
  if (!dateAndAddress.value.address || !dateAndAddress.value.date) {
    useAlertStore().sendAlert(
      AlertStatuses.ERROR,
      !dateAndAddress.value.address
        ? 'Vous devez renseigner une adresse de prise en charge du véhicule'
        : 'vous devez préciser une date et heure de prise en charge du véhicule'
    )

    return null
  }

  return {
    startDate: useUtils().dates.getStrFromDate(dateAndAddress.value.date, 'dd/MM/yyyy HH:mm'), // format: 'dd/MM/yyyy HH:mm'
    pickupAddress: dateAndAddress.value.address,
    quote: {
      tvaRate: tvaRate.value,
      workForces: workforces.value,
      consumables: consumables.value,
      placeAndEquipments: placeAndEquipments.value
    }
  }
}

async function sendQuote() {
  if (!mission.value || quoteUpdateLoading.value === true) return

  const payload = buildMissionProposalPayload()
  if (!payload) return

  quoteUpdateLoading.value = true

  const { error } = await useAPI().missions.updateProfessionalProposal(payload, mission.value._id, {
    mode: AlertModes.ALL,
    successMsg: initialProposal ? 'Devis mis à jour' : 'Devis envoyé !'
  })

  quoteUpdateLoading.value = false

  if (error) return

  useRouter().push('/plateforme/specialiste/mes-missions')
}

async function updatePrivateNote() {
  if (!mission.value) return

  await useAPI().missions.updateProfessionalPrivateNote(privateNote.value, mission.value?._id)
}
</script>

<style lang="scss" scoped>
.quote-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1220px;
  margin: auto;
}

.mobile {
  display: none;
}

.mains-sections {
  display: flex;
  gap: 20px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.quote-summary {
  min-width: 300px;
}

.section-block {
  border: solid 1px black;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px;
}

@media screen and (max-width: 1200px) {
  .section-block {
    border: none;
    padding: 0px;
  }

  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
  .quote-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    .simple-block,
    .mains-sections {
      padding: 0 20px;
    }
  }

  .mains-sections {
    flex-direction: column;
    gap: 40px;
    > div {
      gap: 45px;
    }
  }
}
</style>
