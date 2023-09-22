<template>
  <section id="test">
    <autocomplete-input v-if="issues" v-model="selectedIssues" :options="issuesAsOptions" />
  </section>
</template>

<script lang="ts" setup>
const selectedIssues = ref<IIssue[]>([])
const issues = ref<IIssue[]>([])
const issuesAsOptions = ref<IInputSelectOptions[]>([])

async function fetchData() {
  const response = await useAPI().issues.getIssues()

  if (!response.error && response.data) {
    issues.value = response.data
    issuesAsOptions.value = issues.value.map((issue) => ({ value: issue, display: issue.label }))
  }
}

fetchData()
</script>

<style lang="scss" scoped>
#test {
  margin: auto;
  width: 500px;

  padding: 50px;
  border: solid 1px black;
}
</style>
