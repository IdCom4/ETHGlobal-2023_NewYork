<template>
  <div class="topic-info">
    <div>
      <fa icon="fa-regular fa-clock" class="ic" />
      <span>Durée indicative : &nbsp;</span>
      <span>
        {{ timeConvert(duration) }}
      </span>
    </div>
    <div>
      <fa icon="fa-regular fa-star" class="ic" />
      <span>Complexité : &nbsp;</span>
      <span>
        {{ levelConvert(level) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  duration:{
    type: Array<number>,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  }
})

const timeConvert = (value: number[]) => {
  // If value.length === 2
  if (Array.isArray(value) && value.length === 2) {
    const startHour = Math.floor(value[0] / 4)
    const startMinute = (value[0] % 4) * 15
    const endHour = Math.floor(value[1] / 4)
    const endMinute = (value[1] % 4) * 15
    if (startMinute === 0 || endMinute === 0 || (startMinute === 0 && endMinute === 0)) {
      return `entre ${startHour} heure(s) et ${endHour} heure(s)`
    } else {
      return `entre ${startHour} heure(s) ${startMinute} minute(s) et ${endHour} heure(s) ${endMinute} minute(s)`
    }
  }
  // If value.length === 1
  else if (typeof value === 'number' || value.length < 2) {
    const hour = Math.floor(value[0] / 4)
    const minute = (value[0] % 4) * 15

    if (hour === 0) {
      return `${minute} minutes`
    } else if (minute === 0) {
      return `${hour} heure`
    } else {
      return `${hour} heure et ${minute} minute`
    }
  } else {
    return 'Invalid input'
  }
}

const levelConvert = (level: number) => {
  switch (level) {
    case 1:
      return 'Faible'
      break
    case 2:
      return 'Moyenne'
      break
    case 3:
      return 'Difficle'
      break
  }
}
</script>

<style lang="scss">
.topic-info {
  line-height: 25px;
  margin: 15px 0 25px 0;
  font-family: 'Montserrat';
  font-size: 12px;
  font-weight: 600;
  div {
    display: flex;
    align-items: center;
  }
  .ic {
    margin-right: 10px;
  }
}
</style>
