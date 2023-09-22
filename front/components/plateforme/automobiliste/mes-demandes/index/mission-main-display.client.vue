<template>
  <section v-if="mission" class="mission-main-display">
    <!-- RESPONSIVE NAVIGATION -->
    <button class="responsive-navigation btn_call-to-action" @click="emit('slide-to-list')"><fa :icon="['fas', 'arrow-left']" /></button>

    <!-- INTERLOCUTOR DATA -->
    <div ref="mainCardWrapperElement" class="main-card-wrapper">
      <mission-interlocutor-main-card
        v-if="selectedEntry"
        :mission="mission"
        :entry="selectedEntry"
        issues
        class="main-card"
        @update-show-discussion="(open: boolean) => showDiscussion = open"
      />
    </div>

    <!-- MISSION CONTENT -->
    <div id="main-display-content-wrapper" ref="contentElement" class="content" :style="`--main-card-height: ${mainCardDimensions.height || 0}px`">
      <div
        class="slider"
        :class="{ toggled: showDiscussion }"
        :style="`--content-width: ${contentDimensions.width || 800}px; --content-height: ${contentDimensions.height || 800}px`"
      >
        <!-- MISSION INFOS -->
        <div class="mission-info --slide">
          <!-- CLIENT REQUEST RECAP -->
          <mission-state-wrapper class="--info" :model-value="!openStates[MyMissionEventActions.OPEN_RECAP]" title="La demande">
            <mission-summary :mission="mission" @cancel="emitCanceledMission" />
          </mission-state-wrapper>

          <!-- RECEIVED QUOTE, IF ANY -->
          <mission-state-wrapper
            v-if="selectedEntry?.proposal"
            :model-value="!openStates[MyMissionEventActions.OPEN_QUOTE]"
            class="--info"
            :title="mission.status === MissionStatuses.DELIVERED ? 'Facture' : isProfessional ? 'Devis envoyé' : 'Devis reçu'"
          >
            <mission-proposal-quote :mission="mission" :professional-entry="selectedEntry" />
          </mission-state-wrapper>

          <!-- CHECK MISSION PROGRESS -->
          <mission-state-wrapper
            v-if="mission.status === MissionStatuses.IN_PROGRESS"
            class="--info"
            :model-value="!openStates[MyMissionEventActions.OPEN_PROGRESS]"
            title="Mission en cours"
          >
            <mission-in-progress :mission="mission" :entry="selectedEntry" />
          </mission-state-wrapper>

          <!-- VALIDATE MISSION, IF FINISHED -->
          <mission-state-wrapper
            v-if="mission.status === MissionStatuses.FINISHED"
            class="--info"
            :model-value="!openStates[MyMissionEventActions.OPEN_VALIDATE]"
            title="Finalisation mission"
          >
            <mission-validation v-if="selectedMission.report" :mission="selectedMission" :selected-entry="selectedEntry" />
          </mission-state-wrapper>
        </div>

        <!-- MISSION DISCUSSION -->
        <mission-discussion v-if="selectedEntry" class="mission-discussion --slide" :mission="mission" :selected-entry="selectedEntry" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { MissionStatuses, MyMissionEventActions, TMyMissionsEventPayload } from '@/assets/ts/enums'
import { GlobalEventTypes } from '@/types/constants'

const emit = defineEmits(['slide-to-list', 'data-received'])
const props = defineProps({
  allMissions: { type: Array<IPopulatedMission>, required: true }
})


const mission = ref<IPopulatedMission | null>(null)
const isProfessional = ref<boolean>(false)
const selectedEntry = ref<IMissionProfessionalEntry | null>(null)

const openStates = ref<Partial<Record<MyMissionEventActions, boolean>>>({
  [MyMissionEventActions.OPEN_RECAP]: false,
  [MyMissionEventActions.OPEN_QUOTE]: false,
  [MyMissionEventActions.OPEN_PROGRESS]: false,
  [MyMissionEventActions.OPEN_VALIDATE]: false,
  [MyMissionEventActions.OPEN_INVOICE]: false,
})

const showDiscussion = ref<boolean>(false)
const mainCardWrapperElement = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()
const mainCardDimensions = ref({ height: 0, width: 0 })
const contentDimensions = ref({ height: 0, width: 0 })

watch(() => props.allMissions, () => emit('data-received'))

// update dynamically width properties to keep a tight design
watch(contentElement, () => {
  nextTick(() => {
    if (!contentElement.value) return

    new ResizeObserver(() => {
      if (contentElement.value) {
        contentDimensions.value = {
          height: contentElement.value.getBoundingClientRect().height || 0,
          width: contentElement.value.getBoundingClientRect().width || 0,
        }
      }
    }).observe(contentElement.value)
  })
})
watch(mainCardWrapperElement, () => {
  nextTick(() => {
    if (!mainCardWrapperElement.value) return

    new ResizeObserver(() => {
      if (mainCardWrapperElement.value) {
        mainCardDimensions.value = {
          height: mainCardWrapperElement.value.getBoundingClientRect().height || 0,
          width: mainCardWrapperElement.value.getBoundingClientRect().width || 0,
        }
      }
    }).observe(mainCardWrapperElement.value)
  })
})

// emit canceled mission
function emitCanceledMission() {
  if (!mission.value) return

  useGlobalEvents().emitEvent<TMyMissionsEventPayload>(GlobalEventTypes.MY_MISSIONS, { missionId: mission.value._id, action: MyMissionEventActions.DELETE })
}

// update selected mission if received
useGlobalEvents().subscribeTo<TMyMissionsEventPayload>(GlobalEventTypes.MY_MISSIONS, (payload) => {
  if (!payload) return
  const { missionId, professionalId, action } = payload

  mission.value = props.allMissions.find((mission) => mission._id === missionId) || props.allMissions[0]
  selectedEntry.value = mission.value.professionalEntries.find((entry) => entry.professional._id === professionalId) || mission.value.professionalEntries.find((entry) => entry.proposal || entry.messages.length) || null // mission.value.professionalEntries[0]

  isProfessional.value = useSessionStore().getUser()?._id !== mission.value.clientRequest.client._id

  if (action === MyMissionEventActions.OPEN_DISCUSSION) showDiscussion.value = true
  else {
    showDiscussion.value = false
    for (const _action of Object.values(MyMissionEventActions)) openStates.value[_action] = false

    if (action === MyMissionEventActions.SELECT) openStates.value[MyMissionEventActions.OPEN_RECAP] = true
    else openStates.value[action] = true
  }

  // if a professional was selected by default, emit it
  if (!professionalId && selectedEntry.value) {
    useGlobalEvents().emitEvent<TMyMissionsEventPayload>(GlobalEventTypes.MY_MISSIONS, {
      missionId: missionId,
      professionalId: `${selectedEntry.value.professional._id}`,
      action: MyMissionEventActions.SELECT
    })
  }
})
</script>

<style lang="scss" scoped>
.mission-main-display {
  width: 100%;
  height: 100%;
  position: relative;

  .responsive-navigation {
    display: none;
  }

  .main-card {
    position: relative;
    z-index: 1;
    box-shadow: 0 -3px 30px #000000;
  }

  .content {
    $content-height: calc(100% - var(--main-card-height));
    width: 100%;
    position: relative;
    height: $content-height;
    overflow: hidden;

    .slider {
      display: flex;
      $slide-width: var(--content-width);
      width: calc($slide-width * 2);
      height: 100%;
      position: absolute;
      transition: 0.2s;
      top: 0;
      left: 0;

      &.toggled {
        left: calc($slide-width * -1);
      }

      .--slide {
        width: $slide-width;
        height: 100%;
        overflow-y: scroll;

        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
          display: none;
        }

        &.mission-discussion {
          height: var(--content-height);
        }
      }
    }

    .mission-info {
      height: 100%;
      padding: $spacing-4;

      overflow-x: hidden;
      overflow-y: scroll;

      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }

      .--info + .--info {
        margin-top: $spacing-4;
      }
    }
  }
}

@media screen and (max-width: 1300px) {
  .mission-main-display {
    .responsive-navigation {
      z-index: 2;
      box-shadow: 0 0 5px #000000;
      position: absolute;
      top: $spacing-2;
      left: $spacing-2;

      height: 35px;
      width: 35px;

      border-radius: 100px;
      padding: 0 !important;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content {
      .slider {
        .mission-info {
          .--info + .--info {
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>
