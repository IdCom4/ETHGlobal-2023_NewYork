<template>
  <section id="main-bg">
    <!-- <div id="topbar-top-layer">
      <div class="logo">
        <img src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/02_ValueMyCar_LogotypeNegatif_RVB.png" />
        <p>Rambouillet</p>
      </div>
      <div class="socials">
        <a href="https://www.facebook.com/Valuemycar.centre/"> <fa :icon="['fab', 'facebook']" style="color: #ffffff;" size="2x"/></a>
        <a href="https://www.instagram.com/valuemycar.rambouillet/?hl=fr"><fa :icon="['fab', 'instagram']" style="color: #ffffff;" size="2x"/></a>
        <a href="https://www.linkedin.com/company/valuemycar-fr/"><fa :icon="['fab', 'linkedin']" style="color: #ffffff;" size="2x"/></a>
        <a href="https://www.tiktok.com/@valuemycar.rambouillet"><fa :icon="['fab', 'tiktok']" style="color: #ffffff;" size="2x"/></a>
      </div>
      <hamburger />
    </div>
    <div id="topbar-bottom-layer">
      <nav-buttons />
    </div> -->
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
#main-bg {
  width: 100%;
  height: 80vh;
  background-size: cover;
  background-image: url('https://vmc-static-contents.s3.eu-west-3.amazonaws.com/Photos+Site+Gazeran/Photos+Site+Gazeran/Landing+Principale/WEBP/ValueCenter-Rambouillet_Centre+auto+et+moto+en+libre-service+-+interieur.webp');
  background-position: center;
  #topbar-top-layer {
    border-bottom: 1px solid white;
    height: 80px;
    padding: 0 50px 0 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px); //safari

    .logo {
      height: 50px;
      position: relative;
      img {
        height: 100%;
      }
      p {
        position: absolute;
        color: white;
        bottom: 10px;
        right: -100px;
        font-size: 16px;
      }
    }
    .socials {
      width: 300px;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      & > * {
        cursor: pointer;
      }
    }
    .hamburger {
      cursor: pointer;
      display: none;
      div {
        width: 30px;
        height: 4px;
        background-color: white;
        margin: 5px 0;
      }
    }
  }
  #topbar-bottom-layer {
    border-bottom: 1px solid white;
    height: 70px;
    padding: 0 50px 0 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px); //safari
  }
}

@media (max-width: 900px) {
  #main-bg {
    #topbar-top-layer {
      padding: 0 20px 0 20px;
      height: 60px;
      .logo {
        height: 25px;
        p {
          font-size: 12px;
          bottom: 5px;
          right: -75px;
        }
      }
      .socials {
        display: none;
      }
      .hamburger {
        display: block;
      }
    }
    #topbar-bottom-layer {
      display: none;
    }
  }
}
</style>
