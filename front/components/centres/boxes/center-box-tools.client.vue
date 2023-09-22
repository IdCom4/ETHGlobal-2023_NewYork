<template>
  <section class="center-box-tools">
    <!-- title -->
    <vmc-header class="title --desktop" text="equipements" />
    <h4 class="title --mobile bold">EQUIPEMENTS</h4>

    <ul class="tools-list">
      <li v-for="(tool, i) in tools" :key="i" :class="['tool-list']" :hidden="i >= 3 && !showAll">
        <span class="largest">{{ tool }}</span>
      </li>
    </ul>
    <button :title="showAll ? 'Voir moins' : 'Voir plus'" class="show-btn" @click="showAll = !showAll">
      {{ showAll ? 'Voir moins' : 'Voir plus' }}
    </button>
  </section>
</template>
<script setup lang="ts">
defineProps({
  tools: {
    type: Array,
    default: () => []
  }
})
const showAll = ref(false)
</script>

<style lang="scss">
.center-box-tools {
  padding: 100px clamp(20px, 25vw, 200px);

  .title.--mobile {
    display: none;
  }

  ul {
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .show-btn {
    align-self: flex-end;
    font-weight: 300;
    text-decoration: underline;
    font-family: 'Nunito';
    text-transform: none;
    font-size: 14px;
    padding: 0;
    margin-top: 20px;
  }
}

@media screen and (max-width: 1000px) {
  .center-box-tools {
    padding: 100px clamp(20px, 25vw, 75px);
  }
}

@media screen and (max-width: 700px) {
  .center-box-tools {
    .show-btn {
      width: 100%;
      text-align: right;
    }
    .title {
      &.--desktop {
        display: none;
      }
      &.--mobile {
        display: block;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .center-box-tools {
    padding: 75px 20px;
  }
}
</style>
