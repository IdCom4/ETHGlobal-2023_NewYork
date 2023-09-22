<template>
  <div id="professional-banner">
    <header class="header-profile">
      <div class="layout">
        <div>
          <vmc-profile-picture :user="currentUser" is-professional updatable @update-logo="handleUpdateLogo" />
        </div>
        <div class="profile">
          <div class="test"><professional-name /></div>

          <professional-information class="--desktop" :user="currentUser" />

          <div class="data">
            <professional-reviews-stars class="--desktop" :reviews="currentUser.professionalProfile.clientReviews" />
            <professional-completion class="completion --desktop" :user="currentUser" @open-modal="openModalInformation()" />
          </div>
        </div>
      </div>
      <professional-information class="--mobile" :user="currentUser" />
    </header>

    <professional-details :user="currentUser" />
    <div class="completion --mobile"><professional-completion :user="currentUser" @open-modal="openModalInformation()" /></div>
  </div>

  <modal-edit-information :open-modal="openModal" @close="handleModalClose" @updated="refreshProfile" />
</template>

<script setup lang="ts">
/* <=========== Variable declarations */
const emitEvent = defineEmits(['update-logo'])

// user should be defined at this point
const currentUser = ref<IProfessionalUser>(useSessionStore().user as IProfessionalUser)
const openModal = ref<boolean>(false)

/* >=========== Variable declarations */

function handleUpdateLogo(newImageUrl: string) {
  if (currentUser.value.picture === null || currentUser.value.picture === undefined) return
  else emitEvent('update-logo', newImageUrl)
}

function handleModalClose() {
  openModal.value = false
}

function openModalInformation() {
  openModal.value = true
}

function refreshProfile() {
  currentUser.value = useSessionStore().user as IProfessionalUser
}
</script>

<style lang="scss" scoped>
#professional-banner {
  width: 100%;
  margin-bottom: 60px;
  .layout {
    display: flex;
    gap: $spacing-3;
    padding: 20px 0;
  }

  .header-profile {
    position: relative;
    background: $color-dark-blue;
    padding: 0 20px;
    max-height: 275px;
  }
  .--mobile {
    display: block;
  }
  .--desktop {
    display: none;
  }

  .wrapperStatus {
    margin: $spacing-4;
  }

  .profile {
    display: block;

    width: 100%;

    .data {
      display: flex;
      align-items: center;
      gap: 10px;

      .completion {
        width: 100%;
      }
    }
  }
}

@media (min-width: 950px) {
  #professional-banner {
    .header-profile {
      padding: 0 20px;
    }

    .--mobile {
      display: none;
    }
    .--desktop {
      display: block;
    }
    .layout {
      max-width: 1220px;
      padding: 0px;
      margin: auto;
      display: flex;
    }

    .logo {
      height: 275px;
      width: 275px;
    }

    .profile {
      margin: 0 $spacing-4;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: $spacing-4;
      padding: $spacing-3 0;
      width: 100%;
    }
  }
}

.test {
  display: block;
  width: 100%;
  overflow: hidden;
}
</style>
