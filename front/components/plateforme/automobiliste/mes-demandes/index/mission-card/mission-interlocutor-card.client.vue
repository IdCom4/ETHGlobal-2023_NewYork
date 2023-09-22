<template>
  <div class="mission-interlocutor-card" :class="{ selected }">
    <!-- MAIN DATA -->
    <div class="mission-data" @click="doAction(MyMissionEventActions.SELECT)">
      <!-- PROPOSAL -->
      <div class="proposal">
        <!-- PICTURE -->
        <vmc-profile-picture :user="isProfessional ? mission.clientRequest.client : entry.professional" class="--picture" />

        <!-- DETAILS -->
        <div class="details">
          <h4 class="--title">{{ nameToDisplay }}</h4>

          <p v-if="isProfessional && entry.professional.professionalProfile.company" class="--detail">
            <fa class="icon" :icon="['fas', 'bolt']" /> Entreprise
          </p>
          <p class="--detail"><fa class="icon" :icon="['far', 'calendar']" /> {{ upToDateMoment }}</p>
          <p class="--detail"><fa class="icon" :icon="['fas', 'location-dot']" /> {{ upToDateAddress }}</p>
        </div>
      </div>

      <!-- ISSUES -->
      <div v-if="issues" class="issues">
        <p
          v-for="(issue, index) of mission.clientRequest.issues"
          :key="`mission-data-issue-${issue._id}`"
          class="issue"
          :class="{ 'd-none': index >= 3 }"
        >
          {{ issue.label }}
        </p>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <button class="btn_call-to-action" :class="{ active: nbrUnseenMessages }" @click="doAction(MyMissionEventActions.OPEN_DISCUSSION)">
        {{ nbrUnseenMessages ? 'Nouveau message' : 'Messages' }}
      </button>
      <button
        :class="[
          !isProfessional && mission.status === MissionStatuses.WAITING_FOR_QUOTE ? 'btn_disabled' : 'btn_call-to-action active',
          selected ? '--white' : '--inverted'
        ]"
        @click="doAction(currentActionData.action)"
      >
        {{ currentActionData.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MyMissionEventActions, MissionStatuses, TMyMissionsEventPayload } from '@/assets/ts/enums'
import { GlobalEventTypes } from '@/types/constants'

// eslint-disable-next-line @typescript-eslint/ban-types
type TActionData = { label: string; action?: MyMissionEventActions }

const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  entry: { type: Object as PropType<IMissionProfessionalEntry>, required: true },
  issues: { type: Boolean, required: true }
})

// at this point the user should be logged in and in session store
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const user = useSessionStore().getUser()!
const isProfessional = ref<boolean>(user._id !== props.mission.clientRequest.client._id)
const selected = ref<boolean>(false)
const upToDateAddress = computed(() => {
  const address: IStrictAddress = props.entry.proposal?.pickupAddress || props.mission.clientRequest.idealPickupAddress

  return `${address.street}, ${address.zipCode} ${address.city}`
})
const upToDateMoment = computed(() => {
  const moment = props.entry.proposal?.startDate
    ? useUtils().dates.formatStrDate(props.entry.proposal?.startDate, 'dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy HH:mm')
    : props.mission.clientRequest.idealStartingMoment

  return moment
})
const nbrUnseenMessages = computed(
  () => props.mission.professionalEntries.filter((entry) => entry.messages.some((message) => !message.seenByAt[user._id])).length
)

const nameToDisplay = computed(() => {
  if (!isProfessional.value) {
    return props.entry.professional.professionalProfile.businessName
  } else {
    const vehicle = props.mission.clientRequest.vehicle
    return `${vehicle.brand} | ${vehicle.model}`
  }
})

const actions = reactive<Partial<Record<MissionStatuses, TActionData>>>({
  WAITING_FOR_QUOTE: {
    label: isProfessional.value ? 'Envoyer un devis' : 'En attente de devis',
    action: isProfessional.value ? MyMissionEventActions.UPDATE_QUOTE : undefined
  },
  QUOTE_PENDING: { label: 'Voir le devis', action: MyMissionEventActions.OPEN_QUOTE },
  IN_PROGRESS: { label: isProfessional.value ? 'Terminer la mission' : 'Voir le statut', action: MyMissionEventActions.OPEN_PROGRESS },
  FINISHED: {
    label: isProfessional.value ? 'Voir le statut' : 'Valider la mission',
    action: isProfessional.value ? MyMissionEventActions.OPEN_PROGRESS : MyMissionEventActions.OPEN_VALIDATE
  },
  DELIVERED: { label: 'Voir la facture', action: MyMissionEventActions.OPEN_INVOICE }
})

const currentActionData = computed(() => (actions as Record<string, TActionData>)[props.mission.status])

function doAction(action?: MyMissionEventActions) {
  if (action) {
    // if needed redirect to quote update
    if (action === MyMissionEventActions.UPDATE_QUOTE) useRouter().push('/plateforme/specialiste/outil-devis/' + props.mission._id)
    // else forward the event
    else {
      useGlobalEvents().emitEvent(GlobalEventTypes.MY_MISSIONS, {
        missionId: props.mission._id,
        professionalId: props.entry.professional._id,
        action: action
      })
    }
  }
}

// subscribe to global event mission select to be aware if this professional is selected
useGlobalEvents().subscribeTo<TMyMissionsEventPayload>(GlobalEventTypes.MY_MISSIONS, (payload) => {
  if (!payload) return

  const { missionId, professionalId } = payload

  selected.value = props.mission._id === missionId && props.entry.professional._id === professionalId
})
</script>

<style lang="scss" scoped>
.mission-interlocutor-card {
  background-color: white;
  padding: $spacing-2;

  &.selected {
    background-color: $color-dark-blue;

    .mission-data {
      .proposal {
        .details {
          .--title {
            color: white;
          }

          .--detail {
            color: white;

            .icon {
              color: white;
            }
          }
        }
      }
    }
  }

  .mission-data {
    cursor: pointer;
    .proposal {
      display: flex;
      gap: $spacing-2;
      $picture-width: 100px;

      .--picture {
        height: $picture-width;
        width: $picture-width;
      }

      .details {
        overflow: hidden;
        width: calc(100% - $spacing-2 - $picture-width);

        .--title {
          text-transform: none;
          margin-bottom: $spacing-2;
          font-weight: bold;
          font-style: italic;
          font-size: 17px;
        }

        .--detail {
          overflow-x: hidden;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */

          /* Hide scrollbar for Chrome, Safari and Opera */
          &::-webkit-scrollbar {
            display: none;
          }

          text-overflow: ellipsis;
          white-space: nowrap;

          .icon {
            height: 12px;
            margin-right: $spacing-1;
          }

          & + .--detail {
            margin-top: $spacing-1;
          }
        }
      }
    }

    .issues {
      margin-top: $spacing-2;
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-1;

      .issue {
        padding: 3px 5px;
        border: solid 1px black;
        text-transform: uppercase;
        font-style: italic;

        &.d-none {
          display: none;
        }
      }
    }
  }

  .actions {
    margin-top: $spacing-2;
    display: flex;
    gap: $spacing-1;

    button {
      width: 100%;
      padding: 4px 6px;
      font-size: 11px;
      font-weight: 700;

      &.active {
        border: 2px solid rgba(255, 0, 255, 0.2);
        box-shadow: 3px -2px 5px 0px rgba(255, 0, 255, 0.5), -2px 2px 5px 0px rgba(61, 255, 235, 0.5);
      }
    }
  }
}
</style>
