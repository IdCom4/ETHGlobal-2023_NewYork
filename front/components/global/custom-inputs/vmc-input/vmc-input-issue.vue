<template>
  <section class="vmc-input-issues" @keypress="handleKey">
    <div class="wrapper" :class="{ error: props.error && isEmpty }" @click="open = true">
      <div class="vmc-input-issues__input-mask">
        <div class="vmc-input-issues__input-mask--selected-issues">
          <span v-for="(selectedIssue, i) in selectedIssues" :key="`selectedIssue-${i}`" class="issue-selected">
            {{ selectedIssue }}
            <fa :icon="['far', 'circle-xmark']" :width="15" class="icon-remove" title="Retirez ce service" @click="removeIssue(selectedIssue)" />
          </span>
        </div>
        <div class="vmc-input-issues__input-mask--input-container" title="Entrez un service">
          <input
            id="input-issue"
            ref="inputRef"
            v-model="searchTerm"
            class="input"
            type="text"
            :placeholder="selectedIssues.length === 0 ? props.placeholder : ''"
            @input="handleInput"
            @keyup="handleKeyboard"
            @keydown.enter.prevent
            @blur="handleBlur"
          />
          <label for="input-issue"></label>
        </div>
      </div>
      <fa :icon="['fas', 'magnifying-glass']" class="icon" />
    </div>
    <div v-if="loading" class="vmc-input-issues__loading">
      <vmc-loader size-css="35px" />
    </div>
    <ul v-else v-show="open" ref="issuesListRef" class="vmc-input-issues__issues-list">
      <li
        v-for="(issue, i) in allIssues"
        ref="selectedIssueRef"
        :key="`issue-${i}`"
        :class="{
          'vmc-input-issues__issues-list--issue': true,
          'is-selected': isSelected(i),
          'is-highlighted': navigatationIssueIndex === i
        }"
        @click.prevent="selectIssue(issue.label, i)"
        @keydown.enter="selectIssue(issue.label, i)"
        @keyup.delete="removeIssue(issue.label)"
      >
        {{ issue.label }}
      </li>
    </ul>
    <span v-if="isEmpty && error" class="error-msg">Veuillez sélectionner au moins un problème rencontré</span>
  </section>
</template>

<script setup lang="ts">
import { KeyNames } from '@/types/constants'

const isEmpty = ref<boolean>(false)

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: Boolean,
    default: false
  }
})

// Init value
const open = ref<boolean>(false)
const searchTerm = ref<string>('')
const selectedIssues = ref<string[]>([])
const allIssues = ref<IIssue[]>([])
const selectedIssueRef = ref<HTMLInputElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const issuesListRef = ref<HTMLInputElement | null>(null)
const navigatationIssueIndex = ref<number>(-1)
const loading = ref<boolean>(false)

onMounted(() => {
  inputRef.value?.focus()
  fetchIssues()
  const selectedIssuesJSON = sessionStorage.getItem('selected_issues')
  if (selectedIssuesJSON) {
    selectedIssues.value = JSON.parse(selectedIssuesJSON)
  }
})

// Fetch the issues list
const fetchIssues = async () => {
  const { data: issues } = await useAPI().issues.getIssues()
  if (!issues) return

  allIssues.value = issues
}

// update issues list
watch(searchTerm, (newSearchTerm) => {
  if (newSearchTerm === '') {
    fetchIssues()
  }
})

// set issues to sessionStorage
watch(selectedIssues, () => {
  setIssuesToSessionStorage()
  if (selectedIssues.value.length !== 0) {
    isEmpty.value = false
  } else {
    isEmpty.value = true
  }
})

const setIssuesToSessionStorage = () => {
  const selectedIssuesJSON = JSON.stringify(selectedIssues.value)
  sessionStorage.setItem('selected_issues', selectedIssuesJSON)
}

// Filtered by search field
const filterdIssues = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
  const searchTermFiltered = searchTerm.value.toLowerCase().trim()
  allIssues.value = allIssues.value.filter((issue) => issue.label.toLowerCase().includes(searchTermFiltered))
  if (searchTerm.value === '' && allIssues.value.length === allIssues.value.length) open.value = false
}

const isSelected = (index: number) => {
  const issue = allIssues.value[index]
  if (issue) {
    return selectedIssues.value.includes(issue.label)
  }
  return false
}

// On click to the issue
const selectIssue = (issue: string, index: number): void => {
  if (isSelected(index)) {
    const issueIndex = selectedIssues.value.indexOf(issue)
    if (issueIndex !== -1) {
      selectedIssues.value.splice(issueIndex, 1)
    }
  } else {
    selectedIssues.value.push(issue)
    searchTerm.value = ''
    inputRef.value?.focus()
    setIssuesToSessionStorage()
  }
  if (selectedIssueRef.value) {
    selectedIssueRef.value.classList && selectedIssueRef.value.classList.toggle('is-selected', isSelected(index))
  }
}

// Unselect issues
const removeIssue = (issue: string): void => {
  const index = selectedIssues.value.indexOf(issue)

  if (index !== -1) {
    selectedIssues.value.splice(index, 1)
    setIssuesToSessionStorage()
  }
  inputRef.value?.focus()
}

// handle input
const handleInput = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)

  open.value = true
  filterdIssues()
}

const handleBlur = () => {
  if (selectedIssues.value.length <= 0) isEmpty.value = true
  else isEmpty.value = false
}

const handleKeyboard = (e: KeyboardEvent) => {
  switch (e.code) {
    case KeyNames.ARROW_UP:
    case KeyNames.ARROW_LEFT:
      if (navigatationIssueIndex.value === 0) open.value = false
      if (open.value && issuesListRef.value) {
        navigatationIssueIndex.value = navigatationIssueIndex.value === 0 ? issuesListRef.value.children.length - 1 : navigatationIssueIndex.value - 1
      }
      break

    case KeyNames.ARROW_DOWN:
    case KeyNames.ARROW_RIGHT:
      open.value = true
      if (issuesListRef.value) {
        navigatationIssueIndex.value = navigatationIssueIndex.value === issuesListRef.value.children.length - 1 ? 0 : navigatationIssueIndex.value + 1
      }
      break

    case KeyNames.ENTER:
      if (open.value && issuesListRef.value && navigatationIssueIndex.value !== -1) {
        const issue = issuesListRef.value.children[navigatationIssueIndex.value]
        if (isSelected(navigatationIssueIndex.value)) {
          selectIssue(issue.innerHTML, navigatationIssueIndex.value)
          navigatationIssueIndex.value--
          setIssuesToSessionStorage()
        } else {
          selectIssue(issue.innerHTML, navigatationIssueIndex.value)
          navigatationIssueIndex.value++
        }
      }
      break
  }
}

// To close issues list, the only way that works
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!issuesListRef.value?.contains(target) && !inputRef.value?.contains(target)) {
    open.value = false
  }
})
</script>

<style scoped lang="scss">
.vmc-input-issues {
  // width: 50%;
  margin: 10px 0;
  z-index: 10;
  .wrapper {
    display: flex;
    align-items: center;
    // max-width: 570px;
    border: solid 0.5px;
    &.error {
      border: solid 0.5px $color-error;
    }
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
        white-space: nowrap;
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
  .error-msg {
    color: $color-error;
  }
}
</style>
