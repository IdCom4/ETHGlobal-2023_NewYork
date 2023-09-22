<template>
  <div class="mission-card-recap">
    <!-- MISSION DETAILS -->
    <div class="details" @click="emit('toggle')">
      <!-- VEHICLE -->
      <h4 class="--vehicle">
        <span>{{ `${vehicle.brand} ${vehicle.model}` }}</span> | <span>{{ `${vehicle.plate}` }}</span>
      </h4>

      <!-- ISSUES -->
      <div class="issues">
        <p
          v-for="(issue, index) of mission.clientRequest.issues"
          :key="`mission-data-issue-${issue._id}`"
          class="issue"
          :class="{ 'd-none': index >= 3 }"
        >
          {{ issue.label }}
        </p>
      </div>

      <!-- STATS -->
      <div class="stats">
        <p class="--stat" :class="{ active: nbrUnseenMessages }">
          <fa class="--icon" :icon="['far', 'comment-dots']" /> {{ nbrUnseenMessages }}
          {{ nbrUnseenMessages > 1 ? 'messages non lus' : 'message non lu' }}
        </p>
        <p class="--stat" :class="{ active: nbrQuoteReceived }">
          <fa class="--icon" :icon="['far', 'clipboard']" /> {{ nbrQuoteReceived }} devis {{ nbrQuoteReceived > 1 ? 'reçus' : 'reçu' }}
        </p>
      </div>
    </div>

    <!-- GO TO MISSION -->
    <button class="btn_call-to-action --inverted" @click="selectMission">MISSION</button>
  </div>
</template>

<script lang="ts" setup>
import { MyMissionEventActions } from '@/assets/ts/enums'
import { GlobalEventTypes } from '@/types/constants'

const emit = defineEmits(['toggle'])
const props = defineProps({ mission: { type: Object as PropType<IPopulatedMission>, required: true } })

// at this point the user should be logged in and in session store
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const user = useSessionStore().getUser()!
const vehicle = computed(() => props.mission.clientRequest.vehicle)
const nbrQuoteReceived = computed(() => props.mission.professionalEntries.filter((entry) => entry.proposal).length)
const nbrUnseenMessages = computed(
  () => props.mission.professionalEntries.filter((entry) => entry.messages.some((message) => !message.seenByAt[user._id])).length
)

function selectMission() {
  useGlobalEvents().emitEvent(GlobalEventTypes.MY_MISSIONS, { missionId: props.mission._id, action: MyMissionEventActions.SELECT })
}
</script>

<style lang="scss" scoped>
.mission-card-recap {
  padding: $spacing-2;
  display: flex;
  gap: $spacing-2;
  align-items: flex-start;

  .details {
    width: 100%;
    cursor: pointer;

    .--vehicle {
      span {
        text-transform: none;
        margin-bottom: $spacing-2;
        font-weight: bold;
        font-size: 15px;

        white-space: nowrap;
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

    .stats {
      margin-top: $spacing-2;

      .--stat {
        .--icon {
          height: 12px;
          margin-right: $spacing-1;
        }

        & + .--stat {
          margin-top: $spacing-1;
        }

        &.active {
          .--icon {
            color: $color-neon-blue;
          }
        }
      }
    }
  }

  button {
    width: 85px;
  }
}
</style>
