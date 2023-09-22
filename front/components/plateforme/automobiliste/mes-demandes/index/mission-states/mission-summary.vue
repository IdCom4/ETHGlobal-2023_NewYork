<template>
  <section>
    <div class="items">
      <div>
        <h4 class="categories">Service(s) demandé(s)</h4>
        <div class="issues-display">
          <mission-issues-label :issues="mission.clientRequest.issues" />
        </div>
      </div>
      <div>
        <h4 class="categories">Date de la mission</h4>
        <p class="details">{{ mission.clientRequest.idealStartingMoment }}</p>
      </div>
      <div>
        <h4 class="categories">Adresse de prise en charge</h4>
        <p class="details">
          {{
            `${mission.clientRequest.idealPickupAddress.street}, ${mission.clientRequest.idealPickupAddress.zipCode} ${mission.clientRequest.idealPickupAddress.city}`
          }}
        </p>
      </div>
      <div>
        <h4 class="categories">Véhicule à prendre en charge</h4>
        <p class="details">
          {{ `${mission.clientRequest.vehicle.brand} ${mission.clientRequest.vehicle.model}` }}
        </p>
      </div>
      <div>
        <h4 class="categories">Disposez-vous des pièces nécessaires ?</h4>
        <div style="display: flex; color:black;">
          <vmc-input v-model="hasSpareParts" type="toggle" disabled />
        </div>
      </div>
      <div>
        <h4 class="categories">Description</h4>
        <p class="details">{{ mission.clientRequest.description }}</p>
      </div>

      <div class="attachments-cancel-quote">
        <div class="attachments">
          <img
            v-for="picture of mission.clientRequest.attachments"
            :key="`picture-${picture.fileReferenceId}`"
            :src="picture.fileURL"
            class="vehicle-picture"
          />
        </div>
        <div v-if="isProfessional && !hasBeenAcceptedByProfessional" class="specialist-buttons">
          <button class="btn_denied --white-font" @click="declineMission">Déclinez</button>
          <button class="btn_call-to-action" @click="openQuoteEdition">Ouvrir l'outil de devis</button>
        </div>
        <div v-if="isCancelable && !isProfessional" class="cancel">
          <p class="change_quote">
            Si vous souhaitez apporter des modifications, nous vous invitions à annuler cette demande et à formuler une nouvelle demande de devis
          </p>
          <button class="btn_functional cancel-quote" @click="cancelMission()">
            <Fa icon="fa-solid fa-pencil" class="icon" />
            Annuler votre demande de devis
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { MissionStatuses } from '~~/assets/ts/enums'

const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  hasBeenAcceptedByProfessional: { type: Boolean, default: false }
})
const emits = defineEmits(['cancel', 'deny'])

const hasSpareParts = ref<boolean>(props.mission.clientRequest.hadSpareParts)
const buttonLoading = ref<boolean>(false)
const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)
const isCancelable = ref<boolean>([MissionStatuses.QUOTE_PENDING, MissionStatuses.WAITING_FOR_QUOTE].includes(props.mission.status))

//The client cancels his mission
const cancelMission = async () => {
  if (buttonLoading.value) return

  buttonLoading.value = true

  const response = await useAPI().missions.clientCancelMission(props.mission._id)
  if (!response.error) emits('cancel', props.mission._id)

  buttonLoading.value = false
}

//The professional refuses the client mission
const declineMission = async () => {
  if (buttonLoading.value) return

  buttonLoading.value = true

  const response = await useAPI().missions.professionalRefuseMission(props.mission._id)
  if (!response.error) emits('deny', props.mission._id)

  buttonLoading.value = false
}

//Open quote edition where API call will be done
const openQuoteEdition = () => {
  useRouter().push(`/plateforme/specialiste/outil-devis/${props.mission._id}`)
}
</script>
<style scoped lang="scss">
.items {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 50px;
  .specialist-buttons {
    align-self: center;
  }
}
.categories {
  color: $color-neon-blue;
  margin-bottom: 0.6rem;
}
.issues-display {
  align-items: center;
  display: flex;
  gap: 5px;
  color: black;
}
.details {
  color: white;
  font-size: 14px;
}
.attachments-cancel-quote {
  align-items: center;
  display: flex;
  flex-direction: column;
  align-self: center;
  gap: 40px;
  .cancel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    .cancel-quote {
      color: $color-error;
      text-transform: none;
    }
  }
}
.attachments {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: $spacing-2;

  .vehicle-picture {
    max-width: calc((100% - $spacing-2 * 2) / 3);
  }
}

.change_quote {
  color: white;
  margin: 0 auto;
  max-width: 60%;
  text-align: center;
  word-break: break-word;
}
</style>
