<template>
  <marged-page v-if="professional" id="mission-follow-professional" class="mission-layout">
    <h3 class="header-quote">Mes missions</h3>
    <div class="global-layout">
      <div>
        <mission-overview v-if="missionsList.length" class="overview" :missions-list="missionsList" :is-professional="true" />
      </div>

      <div class="mission-focus">
        <div v-if="selectedCard && selectedMissionOrder > 0" class="item">
          <mission-card :card-info="selectedCard" :is-big-format="true" :is-discussion-open="isDiscussionOpen" />
          <button
            :class="[isDiscussionOpen ? 'switch-to-mission btn_call-to-action --inverted' : 'switch-to-discussion btn_call-to-action']"
            @click="isDiscussionOpen = !isDiscussionOpen"
          >
            {{ isDiscussionOpen ? 'Mission' : 'Messagerie' }}
          </button>
        </div>
        <div v-show="!isDiscussionOpen" v-if="statusOrder && selectedCard && missionsList.length" class="summary">
          <div v-if="selectedMissionOrder >= statusOrder[MissionStatuses.WAITING_FOR_QUOTE]" class="summary-content">
            <mission-state-wrapper :header-title="'Mission'">
              <mission-summary
                v-if="selectedCard"
                :request="clientRequest"
                :mission-id="selectedCard.missionId"
                :is-cancelable="selectedMissionOrder <= statusOrder[MissionStatuses.QUOTE_PENDING]"
                :is-professional="true"
                :has-been-accepted-by-professional="selectedMissionOrder > statusOrder[MissionStatuses.WAITING_FOR_QUOTE]"
                @deny="handleDenyMission"
              />
            </mission-state-wrapper>
          </div>

          <div v-if="selectedMissionOrder >= statusOrder[MissionStatuses.QUOTE_PENDING]" class="summary-content">
            <mission-state-wrapper
              :header-title="selectedMission.status === MissionStatuses.DELIVERED ? 'Facture' : 'Devis envoyé'"
              @close-discussion="isDiscussionOpen = false"
            >
              <quote-sended
                v-if="selectedMission && professional.professionalProfile"
                :mission="selectedMission"
                :professional-proposal="selectedMission.professionalEntries[0].proposal"
                :bottom-text="automobilistMessage"
                :professional-id="selectedCard.userId"
                :company-name="professional.professionalProfile.businessName"
                :is-locked="selectedMissionOrder >= statusOrder[MissionStatuses.IN_PROGRESS]"
                :is-invoice="selectedMissionstatus === MissionStatuses.DELIVERED"
                :is-professional="true"
              />
            </mission-state-wrapper>
          </div>

          <div v-if="selectedMissionOrder === statusOrder[MissionStatuses.IN_PROGRESS]" class="summary-content">
            <mission-state-wrapper
              :header-title="hasMissionStarted ? 'Finaliser la mission' : 'Mission planifiée'"
              @close-discussion="isDiscussionOpen = false"
            >
              <mission-in-progress
                v-if="selectedCard.vehicle"
                :is-professional="true"
                :has-mission-started="hasMissionStarted"
                :mission-praticalities="missionPraticalities"
                :vehicle-mileage="selectedCard.vehicle.mileage"
                :mission-id="selectedMission._id"
                @start-mission="startMission"
              />
            </mission-state-wrapper>
          </div>

          <div v-if="selectedMissionOrder === statusOrder[MissionStatuses.FINISHED]" class="summary-content">
            <mission-state-wrapper :header-title="'En attente de validation'" @close-discussion="isDiscussionOpen = false">
              <mission-validation :is-professional="true" />
            </mission-state-wrapper>
          </div>

          <!--NOT SUPPORTED FOR NOW-->
          <!-- <div v-if="selectedMissionOrder === statusOrder[MissionStatuses.FINISHED]" class="summary-content">
            <mission-state-wrapper :header-title="'Recommendation'">
              <mission-recommendation />
            </mission-state-wrapper>
          </div> -->

          <button
            v-if="selectedMissionOrder <= statusOrder[MissionStatuses.DELIVERED]"
            class="btn_call-to-action"
            style="align-self: center;"
            @click="isDiscussionOpen = !isDiscussionOpen"
          >
            Contacter le client
          </button>
        </div>
        <div v-if="isDiscussionOpen" style="width: 100%;">
          <message-page
            v-if="selectedCard && selectedProfessionalEntry"
            :receiver-id="selectedCard.userId"
            :current-messages="selectedProfessionalEntry.messages"
            :mission-id="selectedMission._id"
            :is-professional-side="true"
          />
        </div>
      </div>
    </div>
  </marged-page>
</template>
<script setup lang="ts">
import { MissionStatuses } from '@/assets/ts/enums'
import { storeToRefs } from 'pinia'
import { GlobalEventTypes } from '@/types/constants'

definePageMeta({ middleware: ['is-authenticated'] })
const missionsList = ref<IPopulatedMission[]>([])
const selectedCard = ref<IMissionCardInfo<ILiteUser>>()

const hasMissionStarted = ref<boolean>(true)
const missionPraticalities = ref<IMissionPraticalities>()
const isDiscussionOpen = ref<boolean>(false)

const selectedMission = ref<IPopulatedMission>(missionsList.value[0])
const selectedProfessionalEntry = ref<IMissionProfessionalEntry>()
const statusOrder = ref()
const { user: professional } = storeToRefs(useSessionStore())
const selectedMissionOrder = ref<number>(-1)
const automobilistMessage =
  'Nous vous invitons à prendre contact avec votre client via la messagerie si vous souhaitez ajuster les lieux et horaires de prise en charge du véhicule.'

const updateSelectedCard = (request: IMissionCardInfo<ILiteUser>) => {
  selectedCard.value = request
  const missionFound = missionsList.value.find((mission) => {
    return mission._id === selectedCard.value?.missionId
  })
  if (missionFound && statusOrder.value) {
    selectedMission.value = missionFound
    selectedMissionOrder.value = statusOrder.value[missionFound.status]
    isDiscussionOpen.value = false
  }
}
const startMission = () => {
  hasMissionStarted.value = true
}
provide<boolean>('isProfessionalCard', false)
provide<ICardInfoInjector<ILiteUser>>('request', { selectedCard: selectedCard, updateSelectedCard })

const clientRequest = computed((): IPopulatedMissionClientRequest | undefined => {
  const mission = missionsList.value.find((missionObj): boolean => {
    return missionObj._id === selectedCard.value?.missionId
  })
  return mission?.clientRequest
})

async function fetchMissions() {
  const { data: missions } = await useAPI().missions.getProfessionalMissions()
  const { data: issues } = await useAPI().issues.getIssues()

  if (!missions?.length || !issues?.length) return

  const populatedMissions = useUtils().missions.populateMissions(missions, issues)

  missionsList.value = populatedMissions

  selectedMission.value = populatedMissions[0]
  selectedCard.value = getDefaultCardInfo(selectedMission.value)
  selectedProfessionalEntry.value = selectedMission.value.professionalEntries.find((entry) => entry.professional._id === professional.value?._id)

  // statusOrder.value = useUtils().missions.associateMissionStatusWithOrder()
  selectedMissionOrder.value = statusOrder.value[selectedMission.value.status]

  if (selectedMission.value.status === MissionStatuses.DELIVERED) hasMissionStarted.value = true
  missionPraticalities.value = useUtils().missions.buildMissionPraticalities(selectedMission.value)
}

function getDefaultCardInfo(mission: IPopulatedMission): IMissionCardInfo<ILiteUser> {
  const missionCard = useUtils().missions.buildCardForProfessional(mission)
  return missionCard
}

const handleDenyMission = (missionId: string) => {
  const index = missionsList.value.findIndex((mission) => mission._id === missionId)

  if (index !== -1) missionsList.value.splice(index, 1)

  //Assign the correct missionOrder to the canceled mission
  if (statusOrder.value) selectedMissionOrder.value = statusOrder.value[MissionStatuses.CANCELED]

  //Checks if another card can be selected
  //If yes, select that card
  if (missionsList.value.length > 0) {
    selectedCard.value = getDefaultCardInfo(missionsList.value[0])
    selectedMission.value = missionsList.value[0]
  }
}
useGlobalEvents().subscribeTo(GlobalEventTypes.MISSION_OPEN_DISCUSSION, (userCardId: unknown) => {
  if (selectedCard.value?.userId === userCardId) {
    isDiscussionOpen.value = !isDiscussionOpen.value
  }
})

fetchMissions()
</script>
<style scoped lang="scss">
.mission-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-quote {
  margin-bottom: 3.1rem;
  max-width: 1220px;
  align-self: center;
  width: 100%;
}
.global-layout {
  align-items: flex-start;
  display: flex;
  gap: 10px;
  justify-content: center;
  max-width: 1220px;
}
.overview {
  align-items: flex-start;
  border: 0.5px solid #000;
  display: flex;
  flex: 1;
  flex-shrink: 0;
  justify-content: center;
}
.mission-focus {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.item {
  background: #fff;
  border: 0.5px solid #000;
  display: flex;
  gap: 10px;
  padding: 20px;
  max-width: 850px;

  .switch-to-discussion {
    box-shadow: -1px 5px lightgray;
    width: 105px;
    height: 105px;
    position: relative;
    transition: none;
    &::after {
      box-shadow: 0px 5px lightgray;
      content: '';
      position: absolute;
      top: 0px;
      right: -14px;
      background-color: $color-dark-blue;
      width: 15px;
      height: 105px;
      &:hover {
        box-shadow: none;
      }
    }
  }
  .switch-to-mission {
    position: relative;
    width: 120px;
    height: 105px;
    transform: translateX(15px);
    transition: none;
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      right: 103px;
      background-color: $color-neon-blue;
      width: 15px;
      height: 105px;
      filter: brightness(125%);
      box-shadow: 2px 2px 5px 1px #979797a8;
    }
  }
}

.summary {
  align-items: flex-start;
  align-self: stretch;
  background: #0c1533;
  border: 0.5px solid #000;
  box-shadow: 0px 15px 19px 0px rgba(0, 0, 0, 0.5) inset;
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 50px;
  padding: 50px;
  max-width: 850px;

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 50px;
    align-self: center;
    width: 100%;
    align-items: center;
    button {
      margin-top: 50px;
      align-self: center;
    }
  }
}
</style>
