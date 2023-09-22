<template>
  <section class="mission-pay">
    <h3>Prochaines Etapes</h3>
    <div class="steps-summary">
      <div class="step-container">
        <div v-for="(stepText, index) in processSteps" :key="`step-${index}`" class="step-item special-text">
          <p>{{ index + 1 }}.</p>
          <p>{{ stepText }}</p>
        </div>
      </div>

      <ul class="summary-container">
        <p class="summary-text">En synthèse :</p>
        <li v-for="(summaryPoint, index) in summary" :key="index" class="summary-text">{{ summaryPoint }}</li>
      </ul>
    </div>
    <payment-method
      :payment-amount="100"
      :is-payment="true"
      @submit-function-loaded="onSubmitFunctionLoaded"
      @card-select="onSelectCreditCard"
      @is-adding="onIsAdding"
    />

    <h3>paiement</h3>

    <price-sum text="Total TTC" class="total-ttc" :price="totalTTC" />
    <p class="error-message">{{ errorMessage }}</p>
    <button class="btn_call-to-action submit-button" :class="{ '--load': isLoading }" @click="confirmPayment">Confirmez le paiement</button>
  </section>
</template>
<script setup lang="ts">
import { PaymentProviderStatuses } from '@/types/external_APIs/payment-provider.enum'
import { usePayment } from '@/composables/usePayment'
import { AlertModes } from '@/types/constants'

const props = defineProps({
  missionId: {
    type: String,
    default: ''
  },
  professionalId: {
    type: String,
    default: ''
  }
})

const processSteps = [
  'Votre paiement sera placé dans notre coffre virtuel jusqu’à la finalisation de la mission.',
  'Confiez votre véhicule au spécialiste.',
  'Vous serez informé de la bonne finalisation de la mission.',
  'Récupérez votre véhicule et assurez vous de la bonne réalisation de la mission.',
  'Confirmez à partir de notre site la réception de votre véhicule.',
  'Le paiement sera alors adressé au spécialiste.',
  'Recevez votre facture.'
]

const summary = [
  'Votre paiement ne sera versé au spécialiste qu’une fois que vous aurez validé la bonne réalisation de la mission et confirmé que votre véhicule n’a pas été endommagé.',
  'Le montant du devis que vous aurez accepté ne pourra plus être modifié par le spécialiste.',
  'Notre équipe reste à votre disposition pour répondre à toutes vos questions.'
]

let paymentSubmitFunction: TPaymentSubmitFunction
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)
const totalTTC = ref<number>(0)
const selectedCreditCard = ref<string>('')
const isAddingCreditCard = ref<boolean>(false)

onBeforeMount(async () => {
  const { data: mission, error } = await useAPI().missions.getClientMissionById(props.missionId)
  if (!mission || error) return

  totalTTC.value = mission.professionalEntries[0].proposal?.quote.totalTTCToClient || 0
})

function onSubmitFunctionLoaded(submitFunction: TPaymentSubmitFunction) {
  paymentSubmitFunction = submitFunction
}

function onIsAdding(newState: boolean) {
  isAddingCreditCard.value = newState
}

function onSelectCreditCard(creditCard: string) {
  selectedCreditCard.value = creditCard
}

const confirmPayment = async (): Promise<void> => {
  errorMessage.value = ''

  if (!selectedCreditCard.value && !isAddingCreditCard.value) {
    errorMessage.value = 'Veuillez choisir ou ajouter un moyen de paiement'
    return
  }
  const request = await useAPI().missions.clientAcceptProfessionalProposal(props.missionId, props.professionalId)
  if (!request.error) useRouter().push(`/plateforme/automobiliste/mes-demandes`)

  // make API call to backend
  const { missionId, professionalId } = props
  isLoading.value = true
  const { data: paymentData } = await useAPI().missions.clientAcceptProfessionalProposal(missionId, professionalId, { mode: AlertModes.ON_ERROR })
  isLoading.value = false

  if (!paymentData || !paymentData.clientSecret) return

  if (paymentData.status === PaymentProviderStatuses.REQUIRE_AUTHENTICATION && paymentData.paymentIntentId) {
    if (selectedCreditCard.value) await usePayment().confirmPayment(paymentData.clientSecret, selectedCreditCard.value, { mode: AlertModes.ON_ERROR })
    else await paymentSubmitFunction(paymentData.clientSecret, { mode: AlertModes.ALL })
  }
}
</script>
<style scoped lang="scss">
.mission-pay {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
}

.steps-summary {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
}

.error-message {
  color: $color-error;
}

.submit-button {
  width: 100%;
}

.total-ttc {
  padding: 15px;
}

.step-item {
  display: flex;
  gap: 5px;

  > p {
    font-family: 'Montserrat';
    font-size: 12px;
    font-style: italic;
    font-weight: 500;
  }
}

.step-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.special-text {
  font-family: 'Montserrat';
  font-size: 1rem;
  font-style: italic;
  font-weight: 500;
}

.summary-text {
  font-family: 'Montserrat';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
}

.summary-container {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > li {
    list-style: inside;
  }
}
</style>
