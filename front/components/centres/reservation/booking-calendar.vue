<template>
  <section class="calendar-container">
    <div class="calendar-header">
      <h4>Sélectionnez un créneau</h4>
      <h2>{{ selectedDayStr }}</h2>
    </div>
    <div class="calendar-content">
      <div class="month-selector">
        <select id="" v-model="selectedMonth" name="" class="select-month">
          <option v-for="month in pickableMonth" :key="month.display" :value="month.value">{{ month.display }}</option>
        </select>
        <div class="next-month-picker">
          <fa
            :icon="['fas', 'chevron-left']"
            class="button-navigate"
            :class="{ disabled: currentDate.getMonth() === selectedMonth }"
            @click="selectNextOrPreviousMonth(-1)"
          />
          <fa
            :icon="['fas', 'chevron-right']"
            class="button-navigate"
            :class="{ disabled: currentDate.getMonth() + maxNextMonth === selectedMonth }"
            @click="selectNextOrPreviousMonth(1)"
          />
        </div>
      </div>
      <table class="calendar-days">
        <div v-if="isLoadingDays" class="loading-mask">
          <vmc-loader :size-css="'50%'" />
        </div>
        <tr>
          <th><h4>Lu</h4></th>
          <th><h4>Ma</h4></th>
          <th><h4>Me</h4></th>
          <th><h4>Je</h4></th>
          <th><h4>Ve</h4></th>
          <th><h4>Sa</h4></th>
          <th><h4>Di</h4></th>
        </tr>
        <tr v-for="dayRow in displayedDays" :key="`day-row-${dayRow[0].date.getDate()}-${dayRow[0].date.getMonth()}`">
          <td v-for="day in dayRow" :key="`day-${day.date.getDate()}-${day.date.getMonth()}`">
            <h4
              :hidden="day.date.getMonth() !== selectedMonth"
              :class="{ disabled: isDisabled(day), selected: isSameDate(selectedDay?.date || new Date(0), day.date) }"
              class="selectable"
              @click="selectDate(day)"
            >
              {{ day.date.getDate() }}
            </h4>
          </td>
        </tr>
      </table>

      <div class="calendar-confirmation">
        <button @click="onCancel">Annuler</button>
        <button @click="onConfirm">Confirmer</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const emits = defineEmits(['close', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<IDateAvailability>,
    default: null
  },
  selectedBoxCategory: {
    type: String as PropType<TBoxCategory>,
    default: null
  },
  selectedFormula: {
    type: Object as PropType<IFormula>,
    default: null
  },
  centerId: {
    type: String,
    default: null
  }
})

const selectedDay = ref<IDateAvailability | null>(props.modelValue)
const pickableMonth = ref<IInputSelectOptions<number>[]>([])
const dateUtils = useUtils().dates
const currentDate = ref<Date>(new Date())
const selectedMonth = ref<number>(new Date().getMonth())
const numberOfRows = 6
const numberOfDaysInWeek = 7
const maxNextMonth = 3
const availableDays = ref<TBoxCategoryMonthAvailabilityMap>({})
const isLoadingDays = ref<boolean>()

watch(
  () => props.modelValue,
  (newValue: IDateAvailability) => {
    selectedDay.value = newValue
  }
)

watch(
  [selectedMonth],
  async () => {
    isLoadingDays.value = true
    availableDays.value =
      (
        await useAPI().bookings.getCenterBoxAvailabilityByMonthAndCategoryAndFormula(
          props.selectedBoxCategory,
          new Date(currentDate.value.getFullYear(), selectedMonth.value, 2),
          props.centerId,
          props.selectedFormula.label
        )
      ).data || {}
    isLoadingDays.value = false
  },
  { immediate: true }
)

const selectedDayStr = computed<string>(() => {
  if (!selectedDay.value) return ''
  return `${selectedDay.value.date.getDate()} ${dateUtils.getMonthName(selectedDay.value.date)} ${selectedDay.value.date.getFullYear()}`
})

const displayedDays = computed<IDateAvailability[][]>(() => {
  return generateDayTable(currentDate.value.getFullYear(), selectedMonth.value, availableDays.value)
})

const generateDayTable = (year: number | string, month: number | string, availableDays: TBoxCategoryMonthAvailabilityMap): IDateAvailability[][] => {
  year = Number(year)
  month = Number(month)
  const weekDayOfFirstDay = dateUtils.getCalibratedDayOfWeek(new Date(year, month, 1).getDay())

  const days: IDateAvailability[][] = []

  let dateIndex = 1 - weekDayOfFirstDay

  let i = 0
  const fullTableLength = numberOfDaysInWeek * numberOfRows
  while (i < fullTableLength) {
    const currentRow: IDateAvailability[] = []
    for (let j = 0; j < numberOfDaysInWeek; j++) {
      const day = new Date(year, month, dateIndex, 23, 45)
      const boxAvailables = availableDays[dateUtils.getStrFromDate(day, 'dd-MM-yyyy')]

      let timesAvailable: TBoxDateAvailabilityMap = {}
      for (const boxTimesAvailable of Object.values(boxAvailables || {})) {
        if (Object.keys(timesAvailable).length === 0) timesAvailable = boxTimesAvailable
        else
          Object.entries(timesAvailable).forEach(([time, isAvailable]) => {
            timesAvailable[time] = isAvailable || boxTimesAvailable[time]
          })
      }

      const isAvailable = timesAvailable ? Object.values(timesAvailable).some((available: boolean) => available === true) : false

      currentRow.push({
        date: day,
        available: isAvailable,
        availability: timesAvailable
      })

      dateIndex++
      i++
    }
    days.push(currentRow)
  }

  return days
}

function isSameDate(date1: Date, date2: Date) {
  return dateUtils.areDatesEqual(date1, date2)
}

function isDisabled(date: IDateAvailability) {
  if (date.available === false) return true
  if (date.date.getMonth() !== selectedMonth.value) return true
  if (date.date.valueOf() < currentDate.value.valueOf()) return true
  return false
}

function selectDate(date: IDateAvailability) {
  if (isDisabled(date)) return
  selectedDay.value = date
  emits('update:modelValue', selectedDay.value)
}

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(num, max))
}

function selectNextOrPreviousMonth(monthIncrement: number) {
  selectedMonth.value = clamp(selectedMonth.value + monthIncrement, currentDate.value.getMonth(), currentDate.value.getMonth() + maxNextMonth)
}

function onCancel() {
  emits('close')
}

function onConfirm() {
  emits('close')
}

function fillPickableMonth() {
  for (let i = 0; i <= maxNextMonth; i++) {
    const currentMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + i)

    pickableMonth.value.push({
      value: currentMonth.getMonth(),
      display: `${dateUtils.getMonthName(currentMonth)}, ${currentDate.value.getFullYear()}`
    })
  }
}

fillPickableMonth()
</script>

<style lang="scss" scoped>
.calendar-content {
  padding: 15px 10px;
}

.calendar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  color: $white;
  background-color: $color-dark-blue;

  padding: 15px 18px;
}

.disabled {
  color: $color-light-grey;

  &path {
    fill: $color-light-grey;
  }
}

.month-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 7px;

  .select-month {
    text-transform: capitalize;
    border: none;
  }

  .next-month-picker {
    gap: 33px;
    display: flex;
  }
}

.button-navigate {
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.calendar-days {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  border-spacing: 10px 10px;
  margin: 5px 0;
  position: relative;

  .loading-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: white;
  }

  td,
  th {
    display: table-cell;
    padding-top: 10px;
  }

  .selectable {
    &:not(.disabled) {
      &:hover,
      &.selected {
        background-color: $color-dark-blue;
        color: $white;
        cursor: pointer;
        border-radius: 3px;
      }
    }

    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    transition: background-color 0.2s, color 0.2s;
  }

  h4 {
    width: 28px;
    height: 28px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
  }
}

.calendar-confirmation {
  display: flex;
  justify-content: flex-end;
}
</style>
