<template>
  <section class="find-us-section">
    <div class="find-us-header">
      <vmc-header text="RETROUVEZ-NOUS" />
      <div class="social-section">
        <p class="largest">valuemycar.rambouillet</p>
        <div class="social-media-stats">
          <p><span>278</span> publications</p>
          <p><span>3401</span> followers</p>
          <p><span>170</span> suivi(e)s</p>
        </div>
      </div>
    </div>

    <div class="mobile-only">
      <img
        src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Centres/Landing+Principale/6.+Le+Centre/Lamborghini-Gallardo-Exterieur-centre-1.webp"
        alt=""
      />
      <p>
        Notre rubrique mensuelle "Le Saviez-Vous ?" vous permet d'en (re)découvrir certains
      </p>
      <p>
        #auto #automobile #automotive #insolite #conceptcar #conceptauto #bmw #BMW #bmwe1 #peugeot #peugeot907 #peugeot907concept #carlover #carlovers
        #carenthusiast
      </p>
    </div>
    <ul class="image-grid">
      <img v-for="image in findUsImages" :key="`find-us-img-${image}`" :src="image" alt="" />
    </ul>

    <vmc-carousel
      :contents="findUsVideos"
      class="video-carousel"
      :auto-scroll="{
        type: 'slideBySlide',
        delayInMs: 5000,
        scrollSpeed: 15,
        restartDelay: 2147462347
      }"
    >
      <template #slide="{ data: { content } }">
        <iframe
          class="youtube-video"
          width="424"
          height="238"
          :src="(content as string)"
          frameborder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </template>
    </vmc-carousel>
  </section>
</template>

<script setup lang="ts">
import { findUsImages } from '@/assets/json/centres/find-us/images'
import { findUsVideos } from '@/assets/json/centres/find-us/youtubeVideos'
</script>

<style lang="scss" scoped>
.find-us-section {
  padding: 75px 20px;
  display: flex;
  flex-direction: column;

  .find-us-header {
    padding-left: 180px;
  }

  .video-carousel {
    align-self: center;
    width: 100%;
    display: flex;
    gap: 30px;
    overflow: auto;
    margin-top: 100px;

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 15px;
    width: 80%;
    max-width: 650px;
    height: auto;
    align-self: center;
    margin-top: 100px;

    img {
      aspect-ratio: 1;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}

.social-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  .social-media-stats {
    display: flex;
    justify-content: space-between;
    max-width: 500px;

    span {
      font-weight: 700;
    }
  }
}

.mobile-only {
  display: none;
}

@media (max-width: 700px) {
  .find-us-section {
    padding: 75px 20px;
    display: flex;
    flex-direction: column;

    .find-us-header {
      padding-left: 0px;
    }

    .mobile-only {
      display: flex;
      flex-direction: column;
      margin-top: 40px;
      gap: 20px;
    }

    .video-carousel {
      width: 100%;
      margin-top: 50px;

      .youtube-video {
        width: 100%;
      }
    }

    .image-grid {
      width: 100%;
      gap: 10px;
      margin-top: 50px;
    }
  }
}
</style>
