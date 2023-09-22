<template>
  <section :class="`service-card ${theme}`">
    <nuxt-link :to="`/centres/services/service/${id}`" class="desktop-link"></nuxt-link>
    <div :class="{ 'skeleton-wrapper': isLoading }">
      <div class="picture">
        <div v-if="bestSale" class="best-sale">Top vente</div>
        <img :src="picture" :alt="`image de ${title}`" />
      </div>
      <div class="content">
        <nuxt-link :to="`/centres/services/service/${id}`" :class="`mobile-link ${theme}`">
          <h4>{{ title }}</h4>
          <p class="subtitle">{{ subtitle }}</p>
          <p v-if="minPrice" class="price">À partir de {{ unitToEuro(minPrice) }}</p>
          <p v-else class="price">Sur devis</p>
          <!-- <p class="description" v-html="description"></p> -->
          <p class="link-service">
            Voir le service
          </p>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  bestSale: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  minPrice: {
    type: Number || null || undefined,
    default: undefined
  },
  picture: {
    type: String,
    default: ''
  },
  description: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

function unitToEuro(unit: number) {
  return useEuroUnit(unit)
}
</script>

<style lang="scss">
.skeleton-wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: #dddbdd;
  .picture {
    width: 100%;
    height: clamp(200px, 22vw, 245px);
    img {
      display: none;
    }
  }
  * {
    visibility: hidden;
  }
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(#fff, 0) 0, rgba(#fff, 0.2) 20%, rgba(#fff, 0.5) 60%, rgba(#fff, 0));
    animation: shimmer 2s infinite;
    content: '';
  }
}

.service-card {
  position: relative;
  display: block;
  flex-grow: 1;
  width: 100%;
  min-width: 260px;
  max-width: 280px;
  height: max-content;
  padding: 10px;
  overflow: hidden;
  transition: 0.3s;
  border: solid 1px transparent !important;
  z-index: 5;
  animation: opacity 1s;

  &.light {
    color: #000;
    padding: 7px;
    margin: 25px 0;
  }
  &:hover {
    transform: translateY(-10px);
    border-color: #c6c6c6 !important;
  }
  .desktop-link {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    height: 100%;
    width: 100%;
    z-index: 99;
  }
  .picture {
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      height: clamp(200px, 22vw, 245px);
      object-fit: cover;
      transition: 5s;
    }
    .best-sale {
      position: absolute;
      top: 0;
      left: 0;
      padding: 6px 20px;
      font-family: 'Nunito';
      font-weight: bold;
      color: #000;
      background-color: $color-neon-blue;
    }
  }
  .content {
    max-width: 250px;
    overflow: hidden;
    h4 {
      display: inline-block;
      width: auto;
      padding: 10px;
      margin-top: 15px;
      font-size: clamp(0.5em, 70%, 0.9vw);
      font-style: italic;
      white-space: nowrap;
      border: solid 0.5px;
    }
    .subtitle {
      margin: 7px 0;
      height: 15px;
    }
    .price {
      margin: 19px 0;
      font-weight: bold;
    }
    .description {
      @include line-clamp(4, 1em);
      font-family: 'Nunito';
      font-size: clamp(50%, 15px, 5vw);
      margin-bottom: 50px;
    }
    a {
      &.light {
        color: #000;
      }
      &.dark {
        color: #fff;
      }
      .mobile-link {
        display: none;
        font-size: 14px;
      }
      .link-service {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .service-card {
    margin: 20px 0;
    max-width: 100%;

    .content {
      max-width: 360px;
      h4 {
        font-size: 14px;
        margin-bottom: 15px;
      }
      .description {
        font-family: 'Nunito';
        font-size: 12px;
        & > * {
          margin-bottom: 15px;
        }
      }
      a {
        .link-service {
          display: block;
          width: 100%;
        }
      }
    }

    .desktop-link {
      display: none;
    }
  }
  .mobile-link:first-of-type {
    display: block;
  }
}

@keyframes opacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
