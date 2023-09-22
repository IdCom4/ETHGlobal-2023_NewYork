<template>
  <section id="center-landing-equipments">
    <!-- title section -->
    <section class="title-wrapper --main-container">
      <vmc-header class="title" text="équipements" />

      <h5 class="subtitle">Tous nos boxes sont équipés</h5>
    </section>

    <!-- equipments section -->
    <section class="equipments-wrapper --main-container">
      <!-- title -->
      <vmc-header class="title --mobile" text="nos équipements" bar-color="white" text-color="white" />
      <h2 class="title --desktop">les boxes et leurs équipements</h2>

      <!-- description -->
      <p class="description">
        <span class="sentence">
          Notre centre automobile est équipé de différents boxes spécialements conçus pour offrir les meilleures prestations à nos clients.
        </span>
        <span class="sentence">
          Nous disposons d'un boxe dédié à la mécanique générale où nous pouvons effectuer toutes les réparations courantes, telles que les vidanges,
          les changements de pneus, les freins, les suspensions et les diagnostics électroniques.
        </span>
      </p>

      <!--equipments list display -->
      <!-- equipment card -->
      <vmc-carousel
        v-model="slideIndex"
        :contents="Object.values(Equipments)"
        class="equipments-list"
        :draggable="true"
        :auto-scroll="{ type: 'slideBySlide', delayInMs: 4000, scrollSpeed: 10, restartDelay: 6000 }"
      >
        <template #slide="{ data: {content} }">
          <div class="equipment-card">
            <!-- equipment image -->
            <div class="image-container">
              <nuxt-img
                class="equipment-image"
                loading="lazy"
                :src="(content as IEquipmentMetaData).image.url"
                :alt="(content as IEquipmentMetaData).image.alt"
              />
            </div>

            <!-- equipment description -->
            <p class="equipment-description">
              {{
                //TODO: Uncomment this when we have the descriptions
                //content.description
                ''
              }}
            </p>
          </div>
        </template>
      </vmc-carousel>
      <div class="slides-progress-container">
        <div class="slide-progress-bar">
          <span :style="{ width: `${(1 / totalSlides) * 100}%`, left: `${(slideIndex / totalSlides) * 100}%` }" class="slide-progress-cursor"></span>
        </div>
        <p>{{ slideIndex + 1 }} - {{ totalSlides }}</p>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { Equipments } from '@/constants/centres/equipments'

const slideIndex = ref<number>(0)
const totalSlides = ref<number>(Object.keys(Equipments).length)
</script>

<style lang="scss" scoped>
#center-landing-equipments {
  .--main-container {
    padding: 75px clamp(20px, 25vw, 200px);
  }

  .title-wrapper {
    background-color: white;
    .subtitle {
      text-transform: none;
    }
  }

  .equipments-wrapper {
    background-color: $color-dark-blue;
    color: white;

    .title {
      width: fit-content;

      &.--mobile {
        display: none;
      }

      &::before,
      &::after {
        display: none;
      }
    }

    .description {
      margin-top: 50px;
      display: flex;
      flex-direction: column;

      .sentence + .sentence {
        margin-top: 15px;
      }
    }

    .equipments-list {
      margin-top: 50px;
      width: 100%;
      overflow-x: auto;
      display: flex;
      flex-direction: row;
      gap: 0 15px;
      position: relative;

      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        display: none;
      }

      .equipment-card {
        .image-container {
          height: 400px;

          .equipment-image {
            height: 100%;
          }
        }

        .equipment-description {
          margin-top: 15px;
        }
      }
    }

    .slides-progress-container {
      display: none;
      flex-direction: column;
      gap: 15px;
      margin-top: 40px;
      align-items: center;

      .slide-progress-bar {
        width: 90%;
        border-bottom: solid 1px $white;
        position: relative;
        .slide-progress-cursor {
          position: absolute;
          border-top: solid 3px $white;
          width: 10px;
          top: -2px;
          transition: left 0.2s;
        }
      }

      p {
        text-align: center;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  #center-landing-equipments {
    .--main-container {
      padding: 100px clamp(20px, 25vw, 75px);
    }
  }
}

@media screen and (max-width: 700px) {
  #center-landing-equipments {
    .--main-container {
      padding: 75px 20px;
    }

    .equipments-wrapper {
      .title {
        &.--desktop {
          display: none;
        }

        &.--mobile {
          display: block;
        }
      }
      .slides-progress-container {
        display: flex;
      }
    }
  }
}
</style>
