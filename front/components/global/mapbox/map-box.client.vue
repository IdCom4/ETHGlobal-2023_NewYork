<template>
  <section id="mapbox">
    <div class="infos-vmc">
      <h5>RETROUVEZ-NOUS</h5>
      <p class="adresse">
        <a
          href="https://www.google.com/maps/place/Centre+ValueMyCar+Rambouillet/@48.6262042,1.8163942,15z/data=!4m5!3m4!1s0x0:0x945d7504199212f3!8m2!3d48.6262041!4d1.8163925"
          target="_blank"
          >3 Rue Hélène Boucher 78125 Gazeran
        </a>
      </p>
      <p>
        Horaires d'ouverture
        <br />
        Lun - Dim : 9h30 - 18h30
      </p>
    </div>
    <!-- <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10548.580643569156!2d1.8163942!3d48.6262042!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x945d7504199212f3!2sCentre%20ValueMyCar%20Rambouillet!5e0!3m2!1sfr!2sfr!4v1677167255958!5m2!1sfr!2sfr"
        width="600"
        height="450"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe> -->
    <mapbox-map :access-token="MAPBOX_ACCESS_TOKEN" map-style="streets-v10" :center="location" :zoom="7" class="mapbox">
      <mapbox-marker :lng-lat="location" color="#0c1533" @click="showPopup = !showPopup">
        <div v-if="showPopup" class="mapbox-popup">
          <a
            href="https://www.google.com/maps/place/Centre+ValueMyCar+Rambouillet/@48.6262042,1.8163942,15z/data=!4m5!3m4!1s0x0:0x945d7504199212f3!8m2!3d48.6262041!4d1.8163925"
            target="_blank"
          >
            Vers Google map
          </a>
        </div>
      </mapbox-marker>
    </mapbox-map>
  </section>
</template>

<script setup lang="ts">
import { MapboxMap, MapboxMarker } from 'vue-mapbox-ts'
import { LOCATION } from '@/constants/constants'

const location = LOCATION.PRESET_COORDS.VALUE_CENTER

const showPopup = ref(false)

const { MAPBOX_ACCESS_TOKEN } = useRuntimeConfig().public
</script>

<style lang="scss">
#mapbox {
  width: 100%;
  height: 200px;
  margin-bottom: 50px;
  .infos-vmc {
    text-align: center;
    h5 {
      margin-bottom: 30px;
    }
    p {
      margin-bottom: 12px;
      a {
        text-decoration: none;
      }
    }
  }
  .mapbox {
    position: relative;
    border: solid 1px #b8b8b8;
    border-radius: 5px;
    overflow: hidden;
    .mapbox-popup {
      position: absolute;
      top: 5%;
      left: 5%;
      padding: 7px;
      border-radius: 5px;
      background-color: #ebebeb;
      box-shadow: 2px 2px 3px 2px #656565d4;
      font-family: 'Nunito';
      font-size: 11px;
      font-weight: 600;
      z-index: 1;
      a {
        color: #000;
      }
    }
  }
}
</style>
