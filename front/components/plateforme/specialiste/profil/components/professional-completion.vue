<template>
  <section>
    <div class="layout">
      <div v-if="!props.user.professionalProfile?.clientReviews && isDesktopLayout" class="informations__status--reviews desktop">
        <professional-reviews-stars :reviews="user.professionalProfile?.clientReviews" />
      </div>
      <div class="informations__status">
        <div class="informations__status--completion">
          <progress-bar :value="props.user.professionalProfile?.completionScore || 0" />
          <button class="editButton" @keydown.enter="openModalInformation" @click="openModalInformation()">
            <Fa id="edit" icon="fa-regular fa-pen-to-square" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emitEvent = defineEmits(['openModal'])
const props = defineProps({
  user: {
    type: Object as () => IUser,
    required: true
  },
  isMobileLayout: {
    type: Boolean,
    default: false
  }
})

const openModal = ref<boolean>(false)

function openModalInformation() {
  openModal.value = true
  emitEvent('openModal', openModal.value)
}
</script>

<style lang="scss" scoped>
.layout {
  margin: 20px;
}
.informations__status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-3;
  flex-wrap: wrap;
  margin-top: $spacing-5;
  &--completion {
    display: flex;
    gap: $spacing-3;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-width: 250px;
  }
}
.editButton {
  background-color: transparent;
}
#edit {
  cursor: pointer;
  color: $color-dark-blue;
}

.desktop {
  display: none;
}
@media (min-width: 950px) {
  .layout {
    margin: 0;
  }
  .informations__status {
    margin-top: 0;
  }
  #edit {
    color: $white;
  }
  .desktop {
    display: block;
  }
}
</style>
