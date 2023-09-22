<template>
  <section id="my-missions-requests-page">
    <h2 class="title">mes missions</h2>
    <my-mission-requests class="my-requests" is-professional />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
$page-padding: 100px;
$title-space: 21px;
$top-margin: 50px;

#my-missions-requests-page {
  padding: $page-padding 0;
  width: 1220px;
  margin: auto;

  .title {
    &:before {
      content: '';
      display: block;
      width: 100%;
      height: 0.5px;
      margin-right: 25px;
      background-color: #000;
    }
  }

  .my-requests {
    margin-top: $top-margin;
    height: calc(100vh - $page-padding * 2 - $title-space - $top-margin);
    min-height: calc(720px - 120px); // screen height - navbar height
  }
}

@media screen and (max-width: 1300px) {
  #my-missions-requests-page {
    width: 100vw;
    padding: 50px 0;

    .my-requests {
      margin-top: 25px;
      height: 100vh;
      min-height: 100vh;
    }
  }
}

@media screen and (max-width: 400px) {
  #my-missions-requests-page {
    padding: 25px 0;

    .my-requests {
      height: calc(100vh - 120px);
      min-height: calc(100vh - 120px);
    }
  }
}
</style>
