<template>
  <mission-professional-decline :mission-id="missionId" :professional-id="professionalId"></mission-professional-decline>
</template>
<script setup lang="ts">
const missionId = useRoute().params.missionId
const professionalId = useRoute().params.slug
</script>
