<template>
  <TrackingSection class="decline-section">
    <h4>Pour quelle(s) raison(s) souhaitez vous refuser ce devis ?</h4>
    <div class="reason-list">
      <vmc-input v-for="(reason, index) in reasons" :key="index" v-model="reason.value" type="checkbox" :label="reason.label"></vmc-input>
      <div class="flex-split">
        <vmc-input v-model="otherReasonSelected" type="checkbox" label="Autre"></vmc-input>
        <input v-model="otherReason" type="text" placeholder="Précisez ..." />
      </div>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <button class="btn_denied --white-font" :class="{ '--load': isLoading }" @click="onDeclineButton">Refusez</button>
  </TrackingSection>
</template>
<script setup lang="ts">
const props = defineProps({
  missionId: { type: String, default: '' },
  professionalId: { type: String, default: '' }
})
const otherReason = ref<string>('')
const otherReasonSelected = ref<boolean>(false)
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

const reasons = ref([
  { label: 'J’ai trouvé une autre solution', value: false },
  { label: 'Le prix est trop élevé', value: false },
  { label: 'Le spécialiste est trop éloigné', value: false }
])

async function onDeclineButton() {
  errorMessage.value = ''
  if (!otherReasonSelected.value && !reasons.value.some((reason) => reason.value)) {
    errorMessage.value = 'Veuillez sélectionner une ou plusieurs raisons pour ce refus'
    return
  }

  if (otherReasonSelected.value && !otherReason.value) {
    errorMessage.value = 'Veuillez précisez la raion de votre refus'
  }

  isLoading.value = true

  const request = await useAPI().missions.clientDenyProfessional(props.missionId, props.professionalId)

  isLoading.value = false
  if (!request.error) useRouter().push(`/plateforme/automobiliste/mes-demandes`)
}
</script>
<style scoped lang="scss">
.flex-split {
  display: flex;
  gap: 10px;
  align-items: baseline;

  input {
    align-self: center;
  }
}

.decline-section {
  gap: 20px;
  h4 {
    text-transform: none;
  }
}

.error-message {
  color: $color-error;
}

.reason-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
