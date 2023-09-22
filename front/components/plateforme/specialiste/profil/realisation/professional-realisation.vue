<template>
  <section v-if="scopedRealisation" class="realisation">
    <!-- FILES -->
    <div class="realisation__files">
      <div class="files-container">
        <vmc-carousel-draft v-model="indexCarousel" :images="filesUrl" class="classTest" draggable no-auto-slide @clicked="photoClicked" />
      </div>

      <div v-for="file in files" :key="`file-section-${file.fileReferenceId}`" class="realisation__files--single"></div>
    </div>

    <!-- TITLE -->
    <div class="realisation__header">
      <h4 class="realisation__header--title">{{ scopedRealisation.title }}</h4>
      <fa icon="fa-regular fa-pen-to-square" @click="updateRealisation = true" />
    </div>

    <!-- DESCRIPTION -->
    <p class="realisation__informations--description">{{ scopedRealisation.description }}</p>

    <!-- FILES CARROUSEL -->
    <professional-realisation-carousel :index="clickIndex" :photos="files" :is-open="openCarrousel" @close="openCarrousel = false" />

    <!-- UPDATE REALISATION -->
    <vmc-modal title="Modification d'une réalisation" :is-open="updateRealisation" max-width="800px" @close="updateRealisation = false">
      <!-- <p>coucou</p> -->
      <realisation-input
        :realisation-to-update="scopedRealisation"
        @updated="emitUpdatedRealisation"
        @added="emitUpdatedRealisation"
        @deleted="emitDeletedRealisation"
      />
    </vmc-modal>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits(['updated', 'deleted'])
const props = defineProps({ realisation: { type: Object as PropType<IRealisation>, default: null } })
const indexCarousel = ref<number>(0)
const scopedRealisation = ref<IRealisation>(useUtils().objects.clone(props.realisation))
const clickIndex = ref<number>(0)
const openCarrousel = ref<boolean>(false)
const updateRealisation = ref<boolean>(false)
const files = computed(() => scopedRealisation.value.files || [])
const filesUrl = computed(() => files.value.map((file) => file.fileURL))

function photoClicked(index: number) {
  clickIndex.value = index
  openCarrousel.value = true
}

function emitDeletedRealisation() {
  updateRealisation.value = false
  emit('deleted')
}

function emitUpdatedRealisation(updatedRealisation: IRealisation) {
  updateRealisation.value = false
  scopedRealisation.value = updatedRealisation
  emit('updated', updatedRealisation)
}

watch(
  () => props.realisation,
  () => (scopedRealisation.value = useUtils().objects.clone(props.realisation)),
  { immediate: true }
)
</script>

<style scoped lang="scss">
.realisation {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  padding: 20px 0;
  // padding: $spacing-4 0;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--title {
      font-family: $main-font;
      text-transform: uppercase;
      font-size: $font-size-3;
      font-weight: $font-weight-4;
    }
  }
}

.fa-pen-to-square {
  cursor: pointer;
}

.files-container {
  // &__flex {
  //   display: flex;
  //   overflow: hidden;
  //   gap: $spacing-3;
  // }
  &__loop {
    &--picture {
      object-fit: cover;
      object-position: center;
      height: 150px;
      width: auto;
      cursor: pointer;
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $black;
    margin: 10px;
    font-size: 16px;
    font-weight: 700;
    &--separator {
      display: inline-block;
      height: 1px;
      width: 35px;
      margin: 0 5px;
      background-color: $black;
    }
  }
}

.container-mobile {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 50px 0 20px 20px;
  h2 {
    color: $color-offwhite;
    margin-bottom: 50px;
    &::after {
      background-color: $color-offwhite;
    }
  }
  .content {
    color: #040404;
    margin-bottom: 100px;
  }
  // &__pictures {
  //   text-align: center;
  //   height: fit-content;
  //   .vmc-carousel {
  //     position: relative;
  //     display: flex;
  //     flex-direction: row;
  //     height: 170px;
  //     backdrop-filter: blur(2px);
  //     // overflow: auto;
  //     -ms-overflow-style: none;
  //     scrollbar-width: none;

  //     &::-webkit-scrollbar {
  //       display: none;
  //     }

  //     img {
  //       display: inline-block;
  //       position: relative;
  //       margin-right: 15px;
  //     }
  //   }
  //   overflow-x: hidden;
  //   .pagination {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     color: $black;
  //     font-size: 16px;
  //     font-weight: 700;
  //     margin: 10px;
  //     &--separator {
  //       display: inline-block;
  //       height: 1px;
  //       width: 35px;
  //       margin: 0 5px;
  //       background-color: $black;
  //     }
  //   }
  // }
}

.vmc-carousel {
  height: 170px;

  .container {
    position: absolute;
    height: 100%;
    img {
      display: inline-block;
      position: relative;
    }
  }
}
</style>
