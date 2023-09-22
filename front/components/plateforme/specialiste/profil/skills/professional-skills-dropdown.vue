<template>
  <div class="drop-down" :class="{ deployed: isDeployed }" :style="`--max-height: ${maxHeight}px`">
    <div class="deploy-button" @click="toggleDeploy">
      <h4>{{ category }}</h4>
      <fa v-if="!isDeployed" icon="fa-solid fa-angle-down" />
      <fa v-else icon="fa-solid fa-angle-up" />
    </div>
    <ul ref="listElement">
      <li
        v-for="(selectableSkill, index) in allSkillsOfCategory"
        :key="`skills-${index}`"
        class="entry"
        :class="isDeployed ? 'deployed' : ''"
        @click="deploy"
      >
        <vmc-input
          :id="`skill-${category}-${selectableSkill.skill._id}`"
          v-model="selectableSkill.selected"
          class="vmc-input"
          type="checkbox"
          :label="selectableSkill.skill.label"
          :checked="selectableSkill.selected"
          :disabled="!isDeployed"
          @input="emitSelectedSkills()"
        />
      </li>
    </ul>
    <div :class="{ fade: !isDeployed }" @click="toggleDeploy"></div>
  </div>
</template>

<script setup lang="ts">
import { SkillCategories } from '@/types/constants/models/skill'

const emits = defineEmits(['update:modelValue'])

const props = defineProps(
{
  modelValue: {
    type: Array<ISkill>,
    default: () => []
  },
  category: {
    type: String as PropType<SkillCategories>,
    default: ''
  },
  skills: {
    type: Array<ISkill>,
    default: () => []
  },
  isDeployed:{
    type: Boolean,
    default: false
  }
})

type TSelectableSkill = { skill: ISkill, selected: boolean }

const allSkillsOfCategory = ref<TSelectableSkill[]>([])
const currentlySelectedSkills = ref<ISkill[]>(useUtils().objects.clone(props.modelValue))
const listElement = ref<HTMLElement>()
const maxHeight = ref<number>(100)

// update skills data at each external update
watch(() => props.modelValue, () => {
  currentlySelectedSkills.value = useUtils().objects.clone(props.modelValue)
  setSkillsAsSelectable()
})

// set skills as selectable at eah update
watch(props.skills, setSkillsAsSelectable)
setSkillsAsSelectable()

function setSkillsAsSelectable() {
  allSkillsOfCategory.value = props.skills.map((skill) => ({
    skill,
    selected: !!props.modelValue.find(selectedSkill => selectedSkill._id === skill._id)
  }))
}

function emitSelectedSkills() {
  const newlySelectedSkills =  allSkillsOfCategory.value.filter(({ selected }) => selected).map(({ skill }) => skill)
  emits("update:modelValue", newlySelectedSkills)
}

const isDeployed = ref<boolean>(props.isDeployed)

watch(() => props.isDeployed, (newValue) => {
  isDeployed.value = newValue
})

const deploy = () => {
  isDeployed.value = true
}

const toggleDeploy = () => {
  updateMaxHeight()
  isDeployed.value = !isDeployed.value
}

// container max height handling
function updateMaxHeight() {
  maxHeight.value = listElement.value?.scrollHeight || 5000
}


onMounted(() => {
  window.addEventListener('resize', updateMaxHeight, true)
  updateMaxHeight()
})

onBeforeUnmount(() => window.removeEventListener('resize', updateMaxHeight, true))
</script>

<style lang="scss" scoped>
.drop-down {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  // min-width: 240px;
  max-height: 100px;
  margin: 20px 0;
  transition: all 0.6s ease-in-out;
  overflow: hidden;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);

  &.deployed {
    max-height: var(--max-height);
  }
  .deploy-button {
    display: flex;
    cursor: pointer;
    flex-direction: row;
    justify-content: space-between;
  }
  ul {
    height: fit-content;
    li.entry {
      // min-width: 240px;
      height: auto;
      margin: 3px 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      overflow: hidden;

      &.deployed {
        :deep(.vmc-input) {
          label {
            transition: font-weight 0.3s ease;
            &:hover {
              font-weight: $font-weight-5;
            }
          }
        }
      }

      :deep(.vmc-input) {
        margin: 0;

        label {
          white-space: normal;
        }
      }
      p {
        // min-width: 240px;
        margin-left: 7px;
        word-wrap: break-word;
        line-height: 14px;
      }
    }
  }

  input[type='checkbox'] {
    border: 1px solid black;
    padding: 0.3em;
    cursor: pointer;
    // -webkit-appearance: none;
  }
  input[type='checkbox']:checked {
    // background-color: $color-neon-blue;
    accent-color: $color-neon-blue;
  }
  .fade {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 30px;
    background: -moz-linear-gradient(top, rgba(137, 255, 241, 0) 0%, rgb(255, 255, 255) 100%); /* FF3.6+ */
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, rgba(137, 255, 241, 0)),
      color-stop(100%, rgb(255, 255, 255) 100%)
    ); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(top, rgba(137, 255, 241, 0) 0%, rgb(255, 255, 255) 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(top, rgba(137, 255, 241, 0) 0%, rgb(255, 255, 255) 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(top, rgba(137, 255, 241, 0) 0%, rgb(255, 255, 255) 100%); /* IE10+ */
    background: linear-gradient(to bottom, rgba(137, 255, 241, 0) 0%, rgb(255, 255, 255) 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0089fff1', endColorstr='#000000',GradientType=0 ); /* IE6-9 */
    cursor: pointer;
  }
}

@media screen and (max-width: 700px) {
  .container {
    .drop-down {
      width: unset;
      // max-height: 30px;
      .entry {
        display: none;
      }
      .fade {
        display: none;
      }
      &.deployed {
        // max-height: 200px;
        .entry {
          display: flex;
        }
      }
    }
  }
}

@media screen and (max-width: 608px) {
  .drop-down {
    margin: 20px auto;
  }
}
</style>
