<template>
  <mission-dispute :mission-id="missionId"></mission-dispute>
</template>
<script setup lang="ts">
const missionId = useRoute().params.slug
</script>
