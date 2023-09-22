<template>
  <section class="search-specialist-section">
    <form class="search-form">
      <autocomplete-input
        v-if="issues.length"
        v-model="selectedIssues"
        :options="issuesAsOptions"
        :options-display-limit="5"
        storage-key="issues"
        placeholder='"lavage châssis", "changement des plaquettes de fr...”'
        icon="fa-solid fa-magnifying-glass"
      />

      <vmc-input
        v-model="address"
        geocoder
        type="address"
        modal-style
        :icon="['fas', 'location-dot']"
        placeholder="Lieu de la mission ( ex : Paris, Bordeaux, Lille ... )"
        @blur="setSessionStorage(address)"
      />
    </form>
    <div class="buttons">
      <nuxt-link to="/plateforme/automobiliste/nouvelle-demande">
        <button class="btn_call-to-action">recherchez un spécialiste</button>
      </nuxt-link>
      <span>ou</span>
      <nuxt-link class="link-specialist" to="/plateforme/specialiste">vous êtes un spécialiste ?</nuxt-link>
    </div>
  </section>
</template>

<script setup lang="ts">
const address = ref<string>('')
const selectedIssues = ref<IIssue[]>([])
const issues = ref<IIssue[]>([])
const issuesAsOptions = ref<IInputSelectOptions[]>([])

async function fetchIssues() {
  const { data, error } = await useAPI().issues.getIssues()

  if (!error && data) {
    issues.value = data
    issuesAsOptions.value = issues.value.map((issue) => ({ value: issue, display: issue.label }))
  }
}
fetchIssues()

onMounted(() => {
  getAddressToLocalStorage()
})

const getAddressToLocalStorage = () => {
  const addressJSON = localStorage.getItem('address_issues')
  if (addressJSON) address.value = JSON.parse(addressJSON)
}

const setSessionStorage = (address: string) => {
  localStorage.setItem('address_issues', JSON.stringify(address))
}
</script>

<style lang="scss" scoped>
.search-specialist-section {
  max-width: 1220px;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 2px 20px #00000084;
  padding: 45px;
  .search-form {
    display: flex;
    justify-content: space-between;
    min-height: 50px;
    gap: 10px;
    margin-bottom: 6px;
    & > * {
      width: 100%;
    }
  }
  .buttons {
    span {
      margin: 0 10px;
    }
    .link-specialist {
      color: #000;
      white-space: nowrap;
      font-family: 'Nunito';
      font-size: 13px;
      text-decoration: underline;
      font-weight: 700;
    }
  }
}

@media screen and (max-width: 600px) {
  .search-specialist-section {
    padding: 17px;

    .search-form {
      flex-direction: column;
      gap: 0;
    }
    .buttons {
      text-align: center;
    }
  }
}
</style>
