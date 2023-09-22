<template>
  <TrackingSection class="layout">
    <h4>Décrivez votre problème</h4>
    <vmc-input v-model="reason" type="textarea" modal-style class="dispute" placeholder="Décrivez votre problème..."></vmc-input>
    <button class="btn_denied --white-font" @click="handleIssue">Signalez un problème</button>
    <p class>Toute réclamation de votre part fera l'objet d'un examen complet de l'équipe ValueMyCar</p>
  </TrackingSection>
</template>
<script setup lang="ts">
const props = defineProps({
  missionId: { type: String, default: '' }
})

const loadingButton = ref<boolean>(false)
const reason = ref<string>('')

const handleIssue = async () => {
  if (loadingButton.value) return
  loadingButton.value = true

  const request = await useAPI().missions.clientOpenDispute(props.missionId, { reason: reason.value })

  loadingButton.value = false
  if (!request.error) useRouter().push(`/plateforme/automobiliste/mes-demandes`)
}
</script>
<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  gap: 30px;

  p {
    width: 30%;
  }
}
.dispute {
  width: 40%;
  text-align: start;
}
</style>
