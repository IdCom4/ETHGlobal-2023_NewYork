<template>
  <section id="main-bg">
    <div class="header">
      <vmc-header text="RESERVEZ VOTRE BOXE" subtext="Réservez votre box équipé à partir de 15 minutes" />
    </div>
    <sec-split-view
      v-for="(box, index) in BOXES"
      :key="`box-${index}`"
      :title="box.titlePage"
      :picture="box.bannerImage"
      :description="box.subtitle"
      :boxes="box.boxes"
      :button-link="'/centres/reservation/' + box.category"
      :view-more-link="'/centres/boxes/' + box.url_box"
      :second-section-style="true"
      button-value="réservez ce box"
    />
  </section>
</template>

<script setup lang="ts">
import { BOXES } from '@/constants/centres/box-content'
</script>

<style lang="scss" scoped>
#main-bg {
  h4 {
    text-transform: none;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 200px;
    height: 200px;
  }
}
@media (max-width: 700px) {
  #main-bg {
    .header {
      padding-left: 20px;
    }
  }
}
</style>
