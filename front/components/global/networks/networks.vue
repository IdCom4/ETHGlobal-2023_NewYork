<template>
  <div class="networks">
    <a href="https://www.facebook.com/Valuemycar.centre" target="_blank" class="logo FB" title="Facebook">
      <fa icon="fa-brands fa-square-facebook" :width="width" :height="height" />
    </a>
    <a href="https://www.youtube.com/channel/UCBeYH8k2JSZJPicRdLo8xfQ" target="_blank" class="logo YT" title="Youtube">
      <fa icon="fa-brands fa-youtube" :width="width" :height="height" />
    </a>
    <a href="https://www.instagram.com/valuemycar.rambouillet/" target="_blank" class="logo IG" title="Instagram">
      <fa icon="fa-brands fa-instagram" :width="width" :height="height" />
    </a>
    <a href="https://www.linkedin.com/company/valuemycar-fr/" target="_blank" class="logo LI" title="LinkedIn">
      <fa icon="fa-brands fa-linkedin" :width="width" :height="height" />
    </a>
    <a
      href="https://twitter.com/ValueMyCar_FR?t=_OB_D1SKlNDnkfHPnA956w&s=07&fbclid=IwAR1SBlpcIvVEcKQ-1xNC9_pHrqT8Y7h-NQNBa9-Eq3U4VxAzYtUjtmNdrHA"
      target="_blank"
      class="logo TW"
      title="Twitter"
    >
      <fa icon="fa-brands fa-square-twitter" :width="width" :height="height" />
    </a>
    <a href="https://www.tiktok.com/@valuemycarfr" target="_blank" class="logo TK" title="TikTok">
      <fa icon="fa-brands fa-tiktok" :width="width" :height="height" />
    </a>
    <a href="" class="logo share" title="Partager">
      <fa icon="fa-solid fa-share-nodes" :width="width" :height="height" />
    </a>
  </div>
</template>
<script setup>
defineProps({
  width: {
    type: Number,
    default: 25
  },
  height: {
    type: Number,
    default: 25
  }
})
</script>
<style lang="scss">
.networks {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  a {
    transition: 0.2s;

    &.logo {
      &:hover {
        transform: scale(1.1);
      }
    }
    &.YT {
      &:hover {
        color: #ff0000;
        filter: drop-shadow(0 0 2px #000);
      }
    }
    &.FB {
      border: solid transparent;
      &:hover {
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.18));
        color: #3b5998;
        border-radius: 5px;
        transform: scale(1);
      }
    }
    &.TK {
      &:hover {
        color: #fff;
        filter: drop-shadow(2.5px 2.5px 0 #ee1d52) drop-shadow(-2.5px -2.5px 0 #69c9d0);
      }
    }
    &.LI {
      &:hover {
        color: #0e76a8;
      }
    }
    &.TW {
      &:hover {
        color: #00acee;
      }
    }
    &.IG {
      &:hover {
        color: #dd2a7b;
        filter: drop-shadow(-2px -2px 1px #8134af);
      }
    }
    &.share {
      &:hover {
        color: rgba(255, 255, 255, 0.169);
        transform: rotate(360deg);
        // filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.502));
      }
    }
  }
}
</style>
