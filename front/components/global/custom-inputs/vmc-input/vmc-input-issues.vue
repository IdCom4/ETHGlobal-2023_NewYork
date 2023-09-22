<template>
  <section class="vmc-input-issues" @keypress="handleKey">
    <div class="wrapper" @click="open = true">
      <div class="vmc-input-issues__input-mask">
        <div class="vmc-input-issues__input-mask--selected-issues">
          <span v-for="(selectedIssue, index) in selectedIssues" :key="`selectedIssue-${index}`" class="issue-selected">
            {{ selectedIssue.label }}
            <fa :icon="['far', 'circle-xmark']" :width="15" class="icon-remove" title="Retirez ce service" @click="removeIssue(selectedIssue._id)" />
          </span>
        </div>
        <div class="vmc-input-issues__input-mask--input-container" title="Entrez un service">
          <input
            id="input-issue"
            ref="inputRef"
            v-model="searchTerm"
            autocomplete="off"
            class="input"
            type="text"
            :placeholder="selectedIssues.length === 0 ? props.placeholder : ''"
            @input="filterIssues"
            @keyup="handleKeyboard"
            @keydown.enter.prevent
          />
          <label for="input-issue"></label>
        </div>
      </div>
      <fa :icon="['fas', 'magnifying-glass']" class="icon" />
    </div>
    <div v-if="loading" class="vmc-input-issues__loading">
      <vmc-loader size-css="35px" />
    </div>
    <ul v-else v-show="open" ref="issueChipsList" class="vmc-input-issues__issues-list">
      <li
        v-for="(issue, index) in filteredIssuesToShow"
        ref="selectedIssueRef"
        :key="`issue-${index}`"
        :class="{
          'vmc-input-issues__issues-list--issue': true,
          'is-selected': isIssueSelected(index),
          'is-highlighted': navigationIssueIndex === index
        }"
        @click.prevent="selectIssue(issue, index)"
        @keydown.enter="selectIssue(issue, index)"
        @keyup.delete="removeIssue(issue._id)"
      >
        {{ issue.label }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { KeyNames } from '@/types/constants'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})

// Init value
const open = ref<boolean>(false)
const searchTerm = ref<string>('')
const selectedIssues = ref<IIssue[]>([])
const filteredIssuesToShow = ref<IIssue[]>([])
let allIssues: IIssue[] = []
const selectedIssueRef = ref<HTMLInputElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const issueChipsList = ref<HTMLInputElement | null>(null)
const navigationIssueIndex = ref<number>(-1)
const loading = ref<boolean>(false)

onMounted(async () => {
  inputRef.value?.focus()
  await fetchIssues()
  loadSelectedIssuesFromLocalStorage()
})

// Fetch the issues list
const fetchIssues = async () => {
  const { data: issues } = await useAPI().issues.getIssues()
  if (!issues) return

  allIssues = issues

  // limit the amount of issues to render into the page,
  // as too many becomes operation heavy and long to rerender at each step
  filteredIssuesToShow.value = allIssues.slice(0, 50)
}

// store issues to sessionStorage
watch(selectedIssues, () => {
  storeIssuesToSessionStorage()
})

const storeIssuesToSessionStorage = () => {
  const selectedIssuesJSON = JSON.stringify(selectedIssues.value)
  sessionStorage.setItem('selected_issues', selectedIssuesJSON)
}

const loadSelectedIssuesFromLocalStorage = () => {
  const selectedIssuesJSON = sessionStorage.getItem('selected_issues')
  if (!selectedIssuesJSON) return

  selectedIssues.value = JSON.parse(selectedIssuesJSON)
}

// Filter by search field
const filterIssues = async () => {
  open.value = true
  loading.value = true

  const processedSearchTerm = searchTerm.value.toLowerCase().trim()
  const allFilteredIssues = processedSearchTerm ? allIssues.filter((issue) => issue.label.toLowerCase().includes(processedSearchTerm)) : allIssues
  filteredIssuesToShow.value = allFilteredIssues.slice(0, 50)

  if (!processedSearchTerm) open.value = false

  loading.value = false
}

const isIssueSelected = (issueIndex: number): boolean => {
  const issue = filteredIssuesToShow.value[issueIndex]

  return issue ? !!selectedIssues.value.find((_issue) => _issue._id === issue._id) : false
}

// On click to the issue
const selectIssue = (issue: IIssue, issueIndex: number) => {
  if (isIssueSelected(issueIndex)) {
    const issueIndex = selectedIssues.value.indexOf(issue)
    if (issueIndex >= 0) selectedIssues.value.splice(issueIndex, 1)
  } else {
    selectedIssues.value.push(issue)
    searchTerm.value = ''
    inputRef.value?.focus()
    storeIssuesToSessionStorage()
  }

  if (selectedIssueRef.value) selectedIssueRef.value.classList && selectedIssueRef.value.classList.toggle('is-selected', isIssueSelected(issueIndex))
}

// Unselect issues
const removeIssue = (issueId: string) => {
  const index = selectedIssues.value.findIndex((issue) => issue._id === issueId)

  if (index >= 0) {
    selectedIssues.value.splice(index, 1)
    storeIssuesToSessionStorage()
  }

  inputRef.value?.focus()
}

const handleKeyboard = (e: KeyboardEvent) => {
  const issueIndex = navigationIssueIndex.value

  switch (e.code) {
    case KeyNames.ARROW_UP:
    case KeyNames.ARROW_LEFT:
      if (issueIndex === 0) open.value = false
      if (open.value && filteredIssuesToShow.value.length)
        navigationIssueIndex.value = issueIndex === 0 ? filteredIssuesToShow.value.length - 1 : issueIndex - 1
      break
    case KeyNames.ARROW_DOWN:
    case KeyNames.ARROW_RIGHT:
      open.value = true
      if (issueChipsList.value) navigationIssueIndex.value = issueIndex === filteredIssuesToShow.value.length - 1 ? 0 : issueIndex + 1
      break

    case KeyNames.ENTER:
      if (!open.value || !issueChipsList.value || issueIndex < 0) break

      selectIssue(filteredIssuesToShow.value[issueIndex], navigationIssueIndex.value)
      navigationIssueIndex.value = (issueIndex + 1) % filteredIssuesToShow.value.length
      break
  }
}

// To close issues list, the only way that works
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!issueChipsList.value?.contains(target) && !inputRef.value?.contains(target)) {
    open.value = false
  }
})
</script>

<style scoped lang="scss">
.vmc-input-issues {
  width: 100%;
  margin: 10px 0;
  z-index: 10;
  .wrapper {
    display: flex;
    align-items: center;
    max-width: 100%;
    border: solid 0.5px;
    .icon {
      cursor: pointer;
      padding-right: 10px;
    }
  }
  &__input-mask {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    min-height: 28px;
    background-color: #fff;
    &--input-container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 28px;
      padding-left: 15px;
      .input {
        width: 100%;
        border: none;
        outline: 0;
      }
    }

    &--selected-issues {
      width: auto;
      max-width: 500px;
      // min-height: 28px;
      display: flex;
      flex-wrap: wrap;
      z-index: 10;
      .issue-selected {
        @extend .vmc-input-issues__issues-list--issue;
        display: flex;
        // white-space: nowrap;
        align-items: center;
        &:hover {
          background-color: #fff !important;
          box-shadow: none !important;
        }
      }
      .icon-remove {
        margin-left: 5px;
      }
    }
  }
  &__issues-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-height: 100px;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    border: solid 0.5px;
    z-index: 10;
    &--issue {
      margin: 3px;
      padding: 2px 4px;
      border: solid 0.5px;
      font: italic 600 12px 'Montserrat';
      text-transform: uppercase;
      background-color: #fff;
      cursor: pointer;
      transition: 0.3s ease;
      &:hover {
        background-color: $color-neon-blue;
        box-shadow: 3px 3px 10px #0000007e;
      }
      &.is-selected {
        background-color: $color-neon-blue;
      }
      &.is-highlighted {
        background-color: $color-neon-blue;
        box-shadow: 3px 3px 10px #0000007e;
        border: none;
      }
    }
  }
  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    background-color: #fff;
  }
}
</style>
