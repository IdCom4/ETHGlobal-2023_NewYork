<template>
  <mission-pay :mission-id="missionId" :professional-id="professionalId"></mission-pay>
</template>
<script setup lang="ts">
const missionId = useRoute().params.missionId
const professionalId = useRoute().params.slug
</script>
