<template>
  <section class="center-box-prices">
    <div class="sec-wrapper">
      <hr class="separator" />
      <!-- title -->
      <vmc-header class="title-desktop" text="tarifs ttc" />
      <h4 class="title-mobile bold">tarifs ttc</h4>

      <ul>
        <li v-for="(formula, i) in centerFormulas" :key="`tarif-${i}`">
          <span class="time largest">{{ formula.label }}</span>
          <span class="price largest">{{ formula.price }}€</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BoxCategories } from '@/constants/constants'

const props = defineProps({
  centerId: { type: String, default: '' },
  boxCategory: { type: String as PropType<BoxCategories>, default: '' }
})

const centerFormulas = ref<IFormula[]>([])

async function getCenterBoxesFormulas() {
  if (!props.centerId || !props.boxCategory) return

  const { data, error } = await useAPI().centers.getCenterFormulas(props.centerId)
  if (error || !data) return

  centerFormulas.value = data[props.boxCategory]
}

watch(() => props.centerId, getCenterBoxesFormulas, { immediate: true })
watch(() => props.boxCategory, getCenterBoxesFormulas, { immediate: true })
</script>

<style lang="scss" scoped>
.center-box-prices {
  padding: 100px;
  display: flex;
  justify-content: flex-start;
  .sec-wrapper {
    width: 400px;
    .separator {
      margin-bottom: 37px;
      display: none;

      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 25%;
        transform: translate(0, -75%);
        border: solid 1px black;
      }
    }

    .title-mobile {
      display: none;
    }
    ul {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        display: flex;
        justify-content: space-between;
        .time {
          font-style: italic;
        }
      }
    }
  }
}

// @media screen and (max-width: 1000px) {
//   .center-box-prices {
//     padding: 100px clamp(20px, 25vw, 75px);
//   }
// }

@media screen and (max-width: 600px) {
  .center-box-prices {
    padding: 37px 20px;

    .sec-wrapper {
      .separator {
        display: block;
      }
      .title-desktop {
        display: none;
      }

      .title-mobile {
        display: block;
      }
    }
  }
}
</style>

<!-- <style lang="scss" scoped>
.center-box-prices {
  padding: 100px clamp(20px, 25vw, 200px);

  .section-separator {
    margin: 0px 20px;
    display: none;

    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 25%;
      transform: translate(0, -75%);
      border: solid 1px black;
    }
  }
}
</style> -->
