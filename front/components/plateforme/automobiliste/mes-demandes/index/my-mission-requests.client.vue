<template>
  <section class="my-missions" :class="{ toggled: focusedSide === 'main-display' }">
    <!-- LIST OF MISSIONS -->
    <aside class="missions --block">
      <!-- NEW REQUEST -->
      <div v-if="!isProfessional" class="new-request">
        <nuxt-link to="/plateforme/automobiliste/nouvelle-demande">
          <button class="btn_call-to-action --white">NOUVELLE DEMANDE <fa icon="fa-solid fa-plus" /></button>
        </nuxt-link>
      </div>

      <!-- LIST OF MISSIONS BY CATEGORY -->
      <section v-if="missionsByStatus" class="missions__list">
        <missions-card-by-status
          v-for="status of sortedStatuses"
          :key="`missions-by-status_${status}`"
          class="status-list"
          :status="status"
          :missions="missionsByStatus[status]"
        />
      </section>
    </aside>

    <!-- DETAILS OF SELECTED MISSION -->
    <main class="missions__selected --block">
      <mission-main-display
        :all-missions="allMissions"
        class="main-display"
        @slide-to-list="focusedSide = 'missions-list'"
        @data-received="childComponentReceivedData = true"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { MyMissionEventActions, MissionStatuses, TMyMissionsEventPayload } from '@/assets/ts/enums'
import { GlobalEventTypes } from '@/types/constants'

const props = defineProps({
  defaultMissionId: { type: String, default: '' },
  isProfessional: { type: Boolean, default: false }
})

const allMissions = ref<IPopulatedMission[]>([])
const defaultSelectedMission = ref<IPopulatedMission | null>()
const missionsByStatus = ref<Partial<Record<MissionStatuses, IPopulatedMission[]>> | null>(null)
const sortedStatuses: MissionStatuses[] = [
  MissionStatuses.FINISHED,
  MissionStatuses.IN_PROGRESS,
  MissionStatuses.QUOTE_PENDING,
  MissionStatuses.DELIVERED
]
const childComponentReceivedData = ref<boolean>(false)

const focusedSide = ref<'missions-list' | 'main-display'>('missions-list')

setupAllProperties()

async function setupAllProperties() {
  allMissions.value = await fetchMissions()
  if (!allMissions.value.length) return

  filterMissionsByStatus()
}

async function fetchMissions(): Promise<IPopulatedMission[]> {
  let response: IRequestResult<IMission[]>
  if (props.isProfessional) {
    response = await useAPI().missions.getProfessionalMissions()
  } else {
    response = await useAPI().missions.getClientMissions()
  }

  const { data, error } = response
  if (!data || error) return []

  const issues = await fetchIssues()
  if (!issues) return []

  const populatedMissions = useUtils().missions.populateMissions(data, issues)

  return populatedMissions
}

async function fetchIssues(): Promise<Array<IIssue> | null> {
  const { data, error } = await useAPI().issues.getIssues()
  if (!data || error) return null

  return data
}

function filterMissionsByStatus() {
  const filteredMissions: Partial<Record<MissionStatuses, IPopulatedMission[]>> = {}

  for (const status of sortedStatuses) filteredMissions[status] = allMissions.value.filter((mission) => mission.status === status)

  // add WAITING_FOR_QUOTE missions to the QUOTE_PENDING, as they are processed as one
  filteredMissions[MissionStatuses.QUOTE_PENDING] =
    filteredMissions[MissionStatuses.QUOTE_PENDING]?.concat(
      allMissions.value.filter((mission) => mission.status === MissionStatuses.WAITING_FOR_QUOTE)
    ) || []

  missionsByStatus.value = filteredMissions
}

// remove canceled mission from the pool
function removeMission(missionId: string) {
  const index = allMissions.value.findIndex((mission) => mission._id === missionId)
  if (index < 0) return

  allMissions.value.splice(index, 1)
}

// set default selected mission
function selectDefaultMission() {
  let defaultMission: IPopulatedMission | undefined
  if (props.defaultMissionId) defaultMission = allMissions.value.find((mission) => mission._id === props.defaultMissionId)
  if (!props.defaultMissionId || !defaultMission) defaultMission = allMissions.value[0]

  defaultSelectedMission.value = defaultMission

  // globaly emit default selected mission
  nextTick(() => {
    if (!defaultSelectedMission.value) return

    useGlobalEvents().emitEvent(GlobalEventTypes.MY_MISSIONS, {
      missionId: defaultSelectedMission.value._id,
      action: MyMissionEventActions.SELECT
    })
  })
}

useGlobalEvents().subscribeTo<TMyMissionsEventPayload>(GlobalEventTypes.MY_MISSIONS, (payload) => {
  if (!payload) return

  const { missionId, action } = payload

  // observe mission cancelation to remove it from the pool
  if (action == MyMissionEventActions.DELETE) {
    removeMission(missionId)
    selectDefaultMission()

    focusedSide.value = 'missions-list'
  } else focusedSide.value = 'main-display'
})

// wait for the component to be created and for missions to be fetched to send the first global event
let isComponentCreated = false
onMounted(() => (isComponentCreated = true))

watch([() => isComponentCreated, allMissions, childComponentReceivedData], () => {
  if (isComponentCreated && allMissions.value.length && childComponentReceivedData.value) selectDefaultMission()
})
</script>

<style lang="scss" scoped>
.my-missions {
  display: flex;
  gap: $spacing-2;
  height: 100%;

  .missions {
    min-width: 400px;
    border: solid 1px black;
    padding: $spacing-3;
    max-height: 100%;
    overflow-y: scroll;

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    .new-request {
      width: 100%;

      a {
        display: block;
        width: 100%;

        button {
          width: 100%;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: $spacing-1;
        }
      }
    }

    .missions__list {
      margin-top: $spacing-4;
      .status-list {
        & + .status-list {
          margin-top: $spacing-3;
        }
      }
    }
  }

  .missions__selected {
    overflow: hidden;
    width: 100%;
    border: solid 1px black;
    background-color: $color-dark-blue;
    height: 100%;
  }
}

@media screen and (max-width: 1300px) {
  .my-missions {
    position: relative;
    width: 200vw;
    padding: 0 2.5vw;
    gap: 5vw;
    height: 100vh;
    transition: 0.5s;
    top: 0;
    left: 0;

    .missions {
      width: calc(95vw);
      padding: $spacing-2;
      min-width: unset;
    }
    .missions__selected {
      width: 95vw;
    }

    &.toggled {
      left: -100vw;
    }
  }
}
</style>
