<template>
  <section>
    <vmc-carousel
      v-model="index"
      class="img-container"
      :contents="imgs"
      :auto-scroll="{ type: 'slideBySlide', delayInMs: 3000, scrollSpeed: 15, restartDelay: 1500 }"
    >
      <template #slide="{ data: { content } }">
        <img :src="(content as string)" alt="" />
      </template>
    </vmc-carousel>

    <h4>{{ index }}</h4>
  </section>
</template>
<script lang="ts" setup>
const imgs = ['https://i.imgur.com/zxf4EQ0.png', 'https://i.imgur.com/zxf4EQ0.png', 'https://i.imgur.com/zxf4EQ0.png']

const index = ref<number>(0)
</script>
<style scoped lang="scss">
section {
  width: 400px;
  display: flex;
  gap: 15px;
}

.img-container {
  display: flex;
  overflow: auto;
  height: 300px;
  flex-direction: row;
  position: relative;
  white-space: nowrap;

  img {
    display: inline-block;
    position: relative;
  }
}
</style>
