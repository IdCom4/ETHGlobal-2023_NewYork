<template>
  <div class="mission-interlocutor-main-card">
    <!-- MAIN DATA -->
    <div class="mission-data">
      <!-- PROPOSAL -->
      <div class="proposal">
        <!-- PICTURE -->
        <vmc-profile-picture :user="isProfessional ? mission.clientRequest.client : entry.professional" class="--picture" />

        <!-- DETAILS -->
        <div class="details">
          <h4 class="--title">{{ nameToDisplay }}</h4>

          <p v-if="!isProfessional && entry.professional.professionalProfile.company" class="--detail">
            <fa class="icon" :icon="['fas', 'bolt']" /> Entreprise
          </p>
          <p class="--detail"><fa class="icon" :icon="['far', 'calendar']" /> {{ upToDateMoment }}</p>
          <p class="--detail"><fa class="icon" :icon="['fas', 'location-dot']" /> {{ upToDateAddress }}</p>

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
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <!-- desktop -->
      <div class="slider" :class="{ toggled: showDiscussion }" @click="showDiscussion = !showDiscussion">
        <button class="btn_call-to-action">Messagerie</button>
        <button class="btn_call-to-action --inverted">Mission</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MyMissionEventActions, TMyMissionsEventPayload } from '@/assets/ts/enums'
import { GlobalEventTypes } from '@/types/constants'

const emit = defineEmits(['update-show-discussion'])
const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  entry: { type: Object as PropType<IMissionProfessionalEntry>, required: true },
  issues: { type: Boolean, required: true }
})

const showDiscussion = ref<boolean>(false)
const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)

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

const nameToDisplay = computed(() => {
  if (!isProfessional.value) return props.entry.professional.professionalProfile.businessName
  else {
    const client = props.mission.clientRequest.client
    return `${client.name} ${client.lastName.toUpperCase()}`
  }
})

useGlobalEvents().subscribeTo<TMyMissionsEventPayload>(
  GlobalEventTypes.MY_MISSIONS,
  (payload) => (showDiscussion.value = !!(payload && payload.action === MyMissionEventActions.OPEN_DISCUSSION))
)

watch(showDiscussion, () => emit('update-show-discussion', showDiscussion.value))
</script>

<style lang="scss" scoped>
$picture-width: 100px;
$button-size: 125px;
.mission-interlocutor-main-card {
  background-color: white;
  width: 100%;
  display: flex;
  gap: $spacing-3;
  padding: $spacing-3;
  .mission-data {
    width: calc(100% - $spacing-2 - $button-size);
    .proposal {
      width: 100%;
      display: flex;
      gap: $spacing-2;

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
          font-size: 20px;
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
    }
  }

  .actions {
    width: $button-size;
    height: $picture-width;
    overflow: hidden;
    position: relative;

    .slider {
      height: 100%;
      width: calc(2 * ($button-size - $spacing-2));
      position: absolute;
      left: 0;
      top: 0;
      transition: 0.2s;

      &.toggled {
        left: calc((100% - $spacing-2 * 2) * -1);
      }
    }

    button {
      width: calc(50%);
      height: 100%;
    }
  }
}

@media screen and (max-width: 700px) {
  .mission-interlocutor-main-card {
    flex-direction: column;

    .mission-data,
    .actions {
      width: 100%;

      &.mission-data {
        .proposal {
          flex-direction: column;

          .--picture,
          .details {
            width: 100%;

            &.--picture {
              height: 30vw;
            }
          }
        }
      }

      &.actions {
        height: 35px;
        width: 100%;

        .slider {
          width: calc(2 * (100% - $spacing-2));
        }
      }
    }
  }
}
</style>
