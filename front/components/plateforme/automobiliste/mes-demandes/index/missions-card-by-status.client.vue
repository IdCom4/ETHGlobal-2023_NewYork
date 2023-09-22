<template>
  <vmc-collapsable v-model="collapsed" class="collapsable-missions-status" title="status-missions" :locked="!missions.length" :no-delay="!collapsed">
    <template #header>
      <div class="collapsable-header" :class="{ collapsed, '--collapsable': !!missions.length }">
        <fa class="--icon" :icon="MissionStatusesMetaData[status].icon" :width="17" :height="17" />
        <h5 class="--status-title">
          {{ statusTitle }} <small>({{ missions.length }})</small>
        </h5>
        <span class="--line"></span>
      </div>
    </template>

    <template #content>
      <div class="wrapper">
        <mission-card v-for="mission of missions" :key="`mission-${status}-${mission._id}`" class="mission-card" :mission="mission" />
      </div>
    </template>
  </vmc-collapsable>
</template>

<script lang="ts" setup>
import { MissionStatuses, TMyMissionsEventPayload } from '@/assets/ts/enums';
import { MissionStatusesMetaData } from "@/assets/json/plateforme"
import { GlobalEventTypes } from '~~/types/constants';

const props = defineProps({
  status: { type: String as PropType<MissionStatuses>, required: true },
  missions: { type: Array<IPopulatedMission>, required: true },
  professional: { type: Boolean, default: false },
})

const statusTitle = computed(() => [MissionStatuses.WAITING_FOR_QUOTE, MissionStatuses.QUOTE_PENDING].includes(props.status) ? 'Demandes de devis' : MissionStatusesMetaData[props.status].translation)

const collapsed = ref<boolean>(true)

// update selected mission if received
useGlobalEvents().subscribeTo(GlobalEventTypes.MY_MISSIONS, (payload) => {
  const { missionId } = payload as TMyMissionsEventPayload

  collapsed.value = !props.missions.find((mission) => mission._id === missionId)
})
</script>

<style lang="scss" scoped>
.collapsable-missions-status {
  .collapsable-header {
    display: flex;
    align-items: center;

    cursor: default;

    &.--collapsable {
      cursor: pointer;
    }

    .--status-title {
      text-transform: none;
      font-size: 14px;
      white-space: nowrap;

      margin: 0 $spacing-2;
    }

    .--line {
      display: block;
      width: 100%;
      height: 1px;
      background-color: black;
    }
  }

  .wrapper {
    padding-top: $spacing-2;
    .mission-card {
      & + .mission-card {
        margin-top: $spacing-2;
      }
    }
  }
}
</style>
