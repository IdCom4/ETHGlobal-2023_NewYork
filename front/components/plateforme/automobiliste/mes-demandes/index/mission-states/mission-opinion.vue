<template>
  <section class="opinion-layout">
    <h2 class="--var-bottom white">Laissez votre avis</h2>
    <h4 class="blue">Qu'avez vous pensé de cette expérience ?</h4>
    <div v-for="(allStars, party, index) in partyNotationStars" :key="party" class="comment">
      <div class="notation">
        <p class="largest">{{ party }}</p>
        <div class="icon">
          <Fa v-for="(iconText, indexStar) in allStars" :key="`${indexStar}`" :icon="iconText" @click="updateNotation(indexStar, party)" />
        </div>
      </div>
      <div class="opinion">
        <h5>Ajoutez un commentaire</h5>
        <vmc-input v-model="textOpinion[index]" type="textarea" placeholder="Laissez votre avis..." :theme="theme" style="align-self: stretch;" />
      </div>
    </div>
    <button class="btn_call-to-action" style="align-self: center;" @click="validateMission">Validez la mission</button>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  missionId: { type: String, default: '' }
})

const partyInvolved = ['Notez le spécialiste', 'Notez votre expérience avec ValueMyCar']
const theme = 'grey'
const emptyStar = 'fa-regular fa-star'
const filledStar = 'fa-solid fa-star'
const partyNotationStars = ref<Record<string, string[]>>({})
const partyNotationNumbers = ref<Record<string, number>>({})
const textOpinion = ref<string[]>(['', ''])
const isButtonsLoading = ref(false)

const updateNotation = (index: number, partyInvolved: string) => {
  for (let i = 0; i <= index; i++) partyNotationStars.value[partyInvolved][i] = filledStar
  partyNotationNumbers.value[partyInvolved] = index

  for (let i = index + 1; i < partyNotationStars.value[partyInvolved].length; i++) partyNotationStars.value[partyInvolved][i] = emptyStar
}
const populatepartyNotation = () => {
  partyNotationStars.value[partyInvolved[0]] = Array(5).fill(emptyStar)
  partyNotationStars.value[partyInvolved[1]] = Array(5).fill(emptyStar)
}
onMounted(() => {
  populatepartyNotation()
})

const validateMission = () => {
  if (isButtonsLoading.value) return

  isButtonsLoading.value = true

  useAPI().missions.clientValidateMission(props.missionId, {
    reviewOfProfessional: { rating: partyNotationNumbers.value[partyInvolved[0]], comment: textOpinion.value[0] },
    reviewOfWebsite: { rating: partyNotationNumbers.value[partyInvolved[1]], comment: textOpinion.value[1] }
  })
  //Make API call
  //TODO: L'api a besoin de l'avis, voir avec Henri comment on gère l'affichage + gestion des notes (3*/5* != "Super expérience, je recommande")

  isButtonsLoading.value = false
}
</script>
<style scoped lang="scss">
.opinion-layout {
  align-items: flex-start;
  color: $white;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-bottom: 0px;
  .blue {
    color: $color-neon-blue;
  }
  .comment {
    align-items: flex-start;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 25px;

    .opinion {
      align-items: flex-start;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .notation {
      align-items: center;
      display: flex;
      justify-content: space-between;
      width: 100%;
      .icon {
        color: $color-orange;
      }
    }
  }
}
</style>
