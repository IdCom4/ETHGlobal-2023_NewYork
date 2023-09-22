<template>
  <section class="quote-modality">
    <h3 class="light">Modalités Pratiques</h3>
    <div class="infos">
      <div>
        <h4>Lieu de Prise en Charge du véhicule</h4>
        <vmc-input v-model="formValues.pickupAddress" type="address" modal-style icon="fa-solid fa-location-dot" />
        <p>L'adresse ci-dessus est celle proposée par le client. Si elle ne vous convient pas, renseignez ci-dessus l'adresse que vous proposez</p>
      </div>
      <div class="starting-moment-container">
        <div class="starting-moment">
          <div>
            <h4>Date</h4>
            <vmc-input v-model="formValues.startDate" type="date" modal-style />
          </div>
          <div>
            <h4>Heure</h4>
            <vmc-input v-model="time" type="time" step="15" min="08:00" max="18:00" modal-style />
          </div>
        </div>
        <p>
          Souhait de l'automobiliste: <span>{{ mission.clientRequest.idealStartingMoment }}</span>
        </p>
      </div>
    </div>

    <button class="btn_call-to-action" @click="updateProposalModalities">Enregistrer</button>
  </section>
</template>

<script setup lang="ts">
type TMissionModalities = { startDate: string; startTime: string; pickupAddress: IStrictAddress }

const emit = defineEmits(['updated'])
const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, default: null },
  entry: { type: Object as PropType<IMissionCompleteProfessionalEntry>, default: null }
})

const formValues = ref<TMissionModalities>(setupForm())

function setupForm(): TMissionModalities {
  const dateFromString = useUtils().dates.getDateFromStr(props.entry.proposal.startDate)
  const dateData = useUtils().dates.getDateData(dateFromString || new Date())

  return {
    startDate: props.entry.proposal.startDate,
    startTime: `${dateData.hours}:${dateData.minutes}`,
    pickupAddress: useUtils().objects.clone(props.entry.proposal.pickupAddress)
  }
}

// TODO: update api to allow modalities update
async function updateProposalModalities() {
  const { data, error } = await useAPI().missions.updateProfessionalProposal(
    {
      startDate: formValues.value.startDate + ' ' + formValues.value.startTime,
      pickupAddress: formValues.value.pickupAddress,
      quote: props.entry.proposal.quote
    },
    props.mission._id
  )

  if (!data || error) return

  emit('updated')
}
</script>

<style lang="scss" scoped>
.quote-modality {
  align-items: flex-start;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;

  h3 {
    align-self: center;
  }
  .infos {
    align-items: flex-start;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .starting-moment-container {
    align-self: stretch;
    align-items: stretch;
    display: flex;
    flex-direction: column;
    .starting-moment {
      display: flex;
      gap: 15px;
      justify-content: flex-start;
      width: 100%;

      & > * {
        flex: 1;
      }
    }
    span {
      font-weight: 700;
    }
  }
}
</style>
