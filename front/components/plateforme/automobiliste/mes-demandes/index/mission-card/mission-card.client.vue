<template>
  <section class="mission-card">
    <mission-interlocutor-card v-if="isMissionStarted || isProfessional" :mission="mission" :entry="visibleProfessionalEntries[0]" :issues="true" />
    <div v-else>
      <mission-card-recap
        :mission="mission"
        class="mission-recap"
        :class="{ clickable: visibleProfessionalEntries.length }"
        @toggle="toggleEntryList"
      />

      <!-- LIST OF PROFESSIONALS ENTRIES, IF ANY -->
      <vmc-collapsable v-if="visibleProfessionalEntries.length" v-model="collapsed">
        <template #header>
          <span></span>
        </template>

        <template #content>
          <mission-interlocutor-card
            v-for="entry of visibleProfessionalEntries"
            :key="`mission-${mission._id}-entry-${entry.professional._id}`"
            class="entry-card"
            :mission="mission"
            :entry="entry"
            :issues="false"
          />
        </template>
      </vmc-collapsable>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { MissionStatuses, TMyMissionsEventPayload } from '@/assets/ts/enums'
import { GlobalEventTypes } from '~~/types/constants'

const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true }
})

const isProfessional = ref<boolean>(useSessionStore().getUser()?._id !== props.mission.clientRequest.client._id)
const visibleProfessionalEntries = ref<IMissionProfessionalEntry[]>(filterVisibleProfessionals())
const isMissionStarted = computed(() => ![MissionStatuses.QUOTE_PENDING, MissionStatuses.WAITING_FOR_QUOTE].includes(props.mission.status))
const selected = ref<boolean>(false)
const collapsed = ref<boolean>(!selected.value)

function filterVisibleProfessionals(): IMissionProfessionalEntry[] {
  if (isProfessional.value) return [props.mission.professionalEntries[0]]

  return props.mission.professionalEntries.filter((entry) => entry.messages.length || entry.proposal)
}

function toggleEntryList() {
  if (visibleProfessionalEntries.value.length) collapsed.value = !collapsed.value
}

// update selected mission if received
useGlobalEvents().subscribeTo(GlobalEventTypes.MY_MISSIONS, (payload) => {
  const { missionId } = payload as TMyMissionsEventPayload

  selected.value = props.mission._id === missionId
  collapsed.value = !selected.value
})
</script>

<style lang="scss" scoped>
.mission-card {
  border: solid 1px black;

  .mission-recap {
    &:not(.clickable) :deep(.details) {
      cursor: unset;
    }
  }

  .entry-card {
    margin-top: $spacing-2;
  }
}
</style>
