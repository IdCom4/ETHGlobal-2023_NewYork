<template>
  <section class="mission-in-progress">
    <div v-if="isProfessional">
      <div v-if="hasMissionStarted" class="current-mission-layout">
        <div class="mission-in-progress-specialist">
          <div class="items">
            <vmc-input v-model="mileage" label="Kilométrage du véhicule" type="number" placeholder="Kilométrage du véhicule" modal-style required />

            <autocomplete-input
              v-if="interventions.length"
              v-model="selectedInterventions"
              :options="interventionOptions"
              label="Interventions réalisées"
              class="autocomplete"
            />
            <div v-if="showOtherInterventions">
              <vmc-input
                v-model="otherIntervention"
                type="text"
                modal-style
                placeholder="Intervention réalisée"
                label="Autres interventions"
                style="width: 100%;"
                @keydown.enter="updateOtherInterventions"
              />
              <div class="selected-interventions" :class="`selected-style_${interventionStyle}`">
                <p
                  v-for="(intervention, index) in selectedOtherInterventions"
                  :key="`selected-other-intervention-${index}-${intervention}`"
                  class="selected-interventions"
                  @click="unselectIntervention(intervention)"
                >
                  <fa icon="fa-regular fa-circle-xmark" class="icon --close" />
                  {{ intervention }}
                </p>
              </div>
            </div>
            <button v-if="!showOtherInterventions" class="add-intervention-container" @click="showOtherInterventions = true">
              <Fa icon="fa-solid fa-plus" class="add-icon" />
              <p class="largest">Ajouter une autre intervention</p>
            </button>
          </div>
          <p class="largest">Ces informations seront vues par votre client</p>
        </div>
        <button class="btn_call-to-action" style="align-self: center;" @click="validateMission">Validez la mission</button>
      </div>
      <div v-else class="current-mission-layout">
        <!-- TODO: update api -->
        <!-- <mission-quote-modality-input :mission="mission" :entry="entry" @updated="reload()" /> -->
        <button class="btn_call-to-action" @click="startMission">Commencez la mission</button>
      </div>
    </div>
    <div v-else class="mission-in-progress-client">
      <p class="largest inverted">En attente de validation de la part du prestataire</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { SelectedOptionStyles } from '@/types/constants'
import { MissionStatuses } from '~~/assets/ts/enums'

const emit = defineEmits(['start-mission'])
const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  entry: { type: Object as PropType<IMissionCompleteProfessionalEntry>, required: true }
})

const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)
const hasMissionStarted = ref<boolean>(props.mission.status === MissionStatuses.IN_PROGRESS)

const mileage = ref<number>(props.mission.clientRequest.vehicle.mileage)
const interventions = ref<IIntervention[]>([])
const selectedInterventions = ref<IIntervention[]>([])
const interventionOptions = ref<IInputSelectOptions[]>([])
const selectedOtherInterventions = ref<string[]>([])
const otherIntervention = ref<string>('')
const interventionStyle = SelectedOptionStyles.CHIP

const showOtherInterventions = ref<boolean>(false)

const buttonLoading = ref<boolean>(false)

//Get all interventions
async function fetchInterventions() {
  const response = await useAPI().interventions.getInterventions()

  //Checks if some intervention exist before mapping them into value & display
  if (!response.error && response.data) {
    interventions.value = response.data
    interventionOptions.value = interventions.value.map((intervention) => ({ value: intervention, display: intervention.label }))
  }
}

const startMission = () => {
  hasMissionStarted.value = true
  emit('start-mission')
}

const updateOtherInterventions = () => {
  if (!selectedOtherInterventions.value.includes(otherIntervention.value) && otherIntervention.value !== '')
    selectedOtherInterventions.value.push(otherIntervention.value)
  otherIntervention.value = ''
}
const unselectIntervention = (intervention: string) => {
  const interventionIndex = selectedOtherInterventions.value.findIndex((otherIntervention) => otherIntervention === intervention)
  if (interventionIndex < 0) return
  selectedOtherInterventions.value.splice(interventionIndex, 1)
}

const validateMission = async () => {
  if (buttonLoading.value) return

  buttonLoading.value = true

  const payload = {
    interventionIds: selectedInterventions.value.map((intervention) => intervention._id),
    otherInterventions: selectedOtherInterventions.value,
    vehicleMileage: mileage.value
  }
  const response = await useAPI().missions.professionalFinishMission(props.mission._id, payload)
  buttonLoading.value = false

  if (response.error) return

  location.reload()
}

fetchInterventions()
</script>

<style scoped lang="scss">
.current-mission-layout {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: black;
  button {
    align-self: flex-start;
  }
}
.mission-in-progress-specialist {
  align-items: flex-start;
  align-self: stretch;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;

  p {
    align-self: center;
  }

  .autocomplete {
    width: 100%;
  }
}

.add-intervention-container {
  align-self: start;
  color: black;
  display: flex;
  gap: 11px;
  .add-icon {
    align-items: center;
    background-color: aqua;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-start;
    padding: 4px 8px 4px 8px;
    width: 10px;
  }

  p {
    align-self: flex-start;
    font-style: normal;
    text-transform: none;
  }
}
.items {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;

  button {
    color: black;
    display: flex;
    text-transform: none;
  }
  .selected-interventions {
    display: flex;

    .selected-interventions {
      display: flex;
      padding: 5px;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .icon.--close {
        height: 12px;
        width: 12px;
      }

      &:hover {
        cursor: pointer;
        background-color: $color-light-grey !important;
        .icon.--close {
          color: $color-error;
        }
      }
    }
    &.selected-style_chip {
      gap: 5px;
      flex-wrap: wrap;

      .selected-interventions {
        border-radius: 2px;
        background-color: #c9c9c9;
        flex-direction: row-reverse;
      }
    }
    &.selected-style_list {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}

.mission-in-progress-client {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
