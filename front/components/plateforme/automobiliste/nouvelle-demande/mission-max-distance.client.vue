<template>
  <centered-section class="mission-max-distance">
    <h4 class="title">Distance maximale</h4>
    <div class="max-distance-container">
      <h5 class="data --distance">{{ maxDistance }} km</h5>
      <input v-model="maxDistance" :error="formError" :error-message="formError" type="range" name="distance" min="0" max="100" @blur="handleBlur" />
      <h5 class="data --available-professionals" :class="{ '--loading': timeout }">
        <span class="text">{{ availableProfessionals >= 0 ? availableProfessionals : '-' }} spécialiste(s)</span>
        <vmc-loader class="loader" size-css="20px" />
      </h5>
    </div>
  </centered-section>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'input', 'validate'])
const props = defineProps({
  modelValue: { type: Number, default: 50 },
  issueIds: { type: Array<string>, default: () => []},
  pickupAddress: { type: Object as PropType<IStrictAddress>, default: null },
  formError: { type: String, default: '' }
})

const availableProfessionals = ref<number>(-1)
const maxDistance = ref<string>(`${props.modelValue}`)
const timeout = ref<number>(0)

// if one of those params is updated, fetch again available professionals base on them
watch([() => props.issueIds, () => props.pickupAddress], ([newIssueIds, newPickupAddress], [oldIssueIds, oldPickupAddress]) => {

  // because of deep reactivity from parent form object, those properties can trigger the watcher without having been updated
  // to check this, compare old values and new values
  const hasIssueIdsChanged = !!(oldIssueIds && newIssueIds.length !== oldIssueIds.length)
  const hasPickupAddressChanged = JSON.stringify(newPickupAddress?.coordinates || []) !== JSON.stringify(oldPickupAddress?.coordinates || [])

  if (hasIssueIdsChanged || hasPickupAddressChanged) fetchAvailableProfessionals()
}, { immediate: true })

// if max distance is updated, emit it
watch(maxDistance, () => {
  // set a timeout to not spam the api
  if (timeout.value) window.clearTimeout(timeout.value)

  // and reset it at each value update
  timeout.value = window.setTimeout(() => {
    handleUpdate(maxDistance.value)
    fetchAvailableProfessionals()
    timeout.value = 0
  }, 500)
})

async function fetchAvailableProfessionals() {
  const { issueIds, pickupAddress } = props
  if (!issueIds.length || !pickupAddress) {
    availableProfessionals.value = 0
    return
  }

  const { data: _availableProfessionals, error } = await useAPI().missions.getAvailableProfessionalsForAddressAndIssues({ issueIds: props.issueIds, address: props.pickupAddress, maxDistance: parseInt(maxDistance.value) })

  if (!_availableProfessionals || error) availableProfessionals.value = -1
  else availableProfessionals.value = _availableProfessionals.length
}

const handleUpdate = (maxDistance: string) => {
  const value = parseInt(`${maxDistance}`)
  emit('update:modelValue', value)
  emit('input', value)
}

const handleBlur = () => {
  emit('validate', 'maxDistance')
}
</script>
<style lang="scss">
.mission-max-distance {
  .title {
    font-weight: 600;
    margin-bottom: $spacing-3;
  }

  .max-distance-container {
    align-items: center;
    display: flex;

    .data {
      white-space: nowrap;

      &.--distance {
        width: 50px;
        margin-right: clamp(5px, 15px, 15px);
      }

      &.--available-professionals {
        max-height: 12px;
        margin-left: clamp(5px, 15px, 15px);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .loader {
          position: absolute;
          display: none;
          top: -4px;
          left: calc(50% - 10px);
        }

        &.--loading {
          .text {
            opacity: 0;
          }

          .loader {
            display: block;
          }
        }
      }
    }

    input {
      cursor: pointer;
      appearance: none;
      background: black;
      outline: none;
      vertical-align: middle;
      width: 400px;
      max-width: 400px;

      &::-webkit-slider-thumb {
        appearance: none;
        background: black;
        border-radius: 50%;
        height: 16px;
        transform: translateY(-50%);
        width: 16px;
      }

      &::-webkit-slider-runnable-track {
        appearance: none;
        background: black;
        height: 1px;
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .max-distance-container {
    h5 {
      margin: 0;
    }

    input {
      margin: 15px 0;
    }
  }

  .mission-max-distance {
    .max-distance-container {
      flex-direction: column;
      align-items: flex-start;

      .data {
        white-space: nowrap;
        margin: 0 !important;

        &.--distance {
          width: fit-content;
        }

        &.--available-professionals {
          &.--loader {
            max-height: 12px;
          }
        }
      }

      input {
        width: 100%;
      }
    }
  }
}
</style>
