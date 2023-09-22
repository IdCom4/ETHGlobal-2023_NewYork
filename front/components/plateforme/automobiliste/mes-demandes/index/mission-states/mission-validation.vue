<template>
  <section>
    <div v-if="isProfessional" class="specialist-layout">
      <p class="largest">
        En attente de validation de la part de votre client. N'hésitez pas à le contacter pour lui demander de valider la mission.
      </p>
      <p class="largest">Si dans un délais de 48h le client n'a pas validé la mission, vous recevrez automatiquement votre paiement.</p>
    </div>
    <div v-else-if="report" class="validation-layout">
      <p class="time-warning">
        Il vous reste <span>{{ convertMillisecondsToTimeString(remainingTime) }}</span> pour contester la réalisation de la mission. Passé ce délai,
        l'argent sera automatiquement viré au spécialiste.
      </p>
      <div class="my-vehicle">
        <div class="mileage">
          <h4>Au Compteur</h4>
          <p class="largest">{{ `${formatNumberWithSpaces(report.vehicleMileage)} km` }}</p>
        </div>
        <div class="interventions">
          <h4>Interventions réalisées</h4>
          <h5 v-for="intervention of allInterventions" :key="`intervention-${intervention}-${Math.random()}`">
            {{ intervention }}
          </h5>
        </div>
      </div>
      <div class="billing-adress-container">
        <div class="billing-adress">
          <h4>Adresse de facturation</h4>
          <vmc-input v-model="billingAddress" type="address" icon="fa-solid fa-location-dot" modal-style :theme="'dark'" />
        </div>

        <small>Je ne trouve pas mon adresse</small>
      </div>
      <div class="appreciation">
        <h4>Avez-vous récupéré votre véhicule en bon état ?</h4>
        <vmc-input v-model="isVehicleInGoodState" type="toggle" />
        <h4>La mission a-t-elle été correctement effectuée ?</h4>
        <div v-if="!isOpinionVisible" class="validation-buttons">
          <button v-if="!mission.dispute" class="btn_denied --white-font" @click="handleIssue">Signalez un problème</button>
          <button class="btn_call-to-action" @click="showOpinion()">Valider la mission</button>
        </div>
      </div>
      <div v-if="isOpinionVisible" class="opinion">
        <mission-opinion :mission-id="mission._id" style="width: 100%;" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  selectedEntry: { type: Object as PropType<IMissionProfessionalEntry>, required: true }
})

const _48HoursInMs = 172800
const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)
const billingAddress = ref<string>(
  addressToString(isProfessional.value ? null : useSessionStore().getUser()?.billingAddress || useSessionStore().getUser()?.homeAddress || null)
)
const report = ref<IMissionReport | null>(props.mission.report || null)
const isOpinionVisible = ref<boolean>(false)
const allInterventions = ref<string[]>([])
const isVehicleInGoodState = ref<boolean>(true)

const fetchInterventions = async () => {
  const { data: interventions } = await useAPI().interventions.getInterventions()

  if (!interventions?.length || !report.value) return
  const missionInterventionLabels: string[] = []
  report.value.interventionIds.forEach((interventionId) => {
    const interventionFound = interventions.find((intervention) => intervention._id === interventionId)
    if (interventionFound) missionInterventionLabels.push(interventionFound.label)
  })

  allInterventions.value = missionInterventionLabels.concat(report.value.otherInterventions)
}

function addressToString(address: IAddress | null): string {
  if (!address) return ''
  return `${address.street}, ${address.zipCode} ${address.city}`
}

const remainingTime = computed<number>(() => {
  if (!props.mission.finishedAt) return 48 * 3600 * 1000
  const limitTime = Date.now() + _48HoursInMs
  const quoteSentAtDate = useUtils().dates.getDateFromStr(props.mission.finishedAt)
  const quoteSentAtTime = quoteSentAtDate ? quoteSentAtDate.getTime() : 0
  return limitTime - quoteSentAtTime
})

const showOpinion = () => {
  isOpinionVisible.value = true
}

const handleIssue = () => {
  useRouter().push(`/plateforme/automobiliste/mes-demandes/dispute/${props.mission._id}`)
}
const convertMillisecondsToTimeString = (millisecond: number): string => {
  return millisecond > 3600000 ? `${Math.round(millisecond / 3600000)} h` : `${Math.round(millisecond / 60000)} min`
}

const formatNumberWithSpaces = (number: number): string => {
  const numberString = number.toString()
  let formattedNumber = ''

  for (let i = numberString.length - 1; i >= 0; i--) {
    formattedNumber = numberString[i] + formattedNumber
    if ((numberString.length - i) % 3 === 0 && i !== 0) {
      formattedNumber = ' ' + formattedNumber
    }
  }

  return formattedNumber
}
fetchInterventions()
</script>
<style scoped lang="scss">
.specialist-layout {
  display: flex;
  padding: 30px 0px 50px 0px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  align-self: stretch;
  color: $white;
  p {
    gap: 10px;
    text-align: center;
  }
  :nth-child(2) {
    font-style: italic;
  }
}
.validation-layout {
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  align-items: flex-start;
  gap: 50px;
  align-self: stretch;
  color: white;
  .time-warning {
    text-align: center;
    font-style: italic;
    text-decoration: underline;
    padding: 0px 50px;
    span {
      font-weight: 700;
    }
  }
  .my-vehicle {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
    align-self: stretch;

    .mileage {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      align-self: stretch;
    }
    .interventions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      align-self: stretch;

      h5 {
        text-transform: none;
      }
    }
  }
  .billing-adress-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    .billing-adress {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 9px;
      align-self: stretch;
      :nth-last-child(1) {
        width: 100%;
      }
    }
    small {
      font-style: italic;
      text-decoration: underline;
    }
  }
  .appreciation {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    .validation-buttons {
      display: flex;
      padding: 0px 93px;
      justify-content: center;
      align-items: flex-start;
      gap: 98px;
      align-self: stretch;
      button {
        width: 100%;
      }
    }
  }
  .opinion {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  h4 {
    color: $color-neon-blue;
  }
}
</style>
