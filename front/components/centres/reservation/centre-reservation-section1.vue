<template>
  <section id="main-bg">
    <div id="topbar-top-layer">
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
      <div class="hamburger">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div id="topbar-bottom-layer">
      <div class="button-flex">
        <a><p class="click-tab">Nos boxes</p></a>
        <a><p class="click-tab">Boutique</p></a>
        <a><p class="click-tab">Evenements</p></a>
        <button class="btn_call-to-action">ME CONNECTER</button>
        <button class="btn_call-to-action">CREER UN COMPTE</button>
        <div class="vertical-separator"></div>
        <div class="hamburger">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
#main-bg {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url('https://images.alphacoders.com/960/960702.jpg');
  #topbar-top-layer {
    border-bottom: 1px solid white;
    height: 100px;
    padding: 0 50px 0 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #0c1533;

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
    height: 100px;
    padding: 0 50px 0 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    background-color: #0c1533;
    .button-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;
      .click-tab {
        font-size: 11px;
        color: white;
        padding: 0 20px 0 20px;
        font-weight: bold;
        cursor: pointer;

        user-select: none; /* Standard syntax */
      }
      .btn_call-to-action {
        padding: 6px 12px !important;

        font-family: 'Montserrat';
        font-style: italic;
        font-weight: 700;
        font-size: 8px;
        line-height: 10px;
      }
      .vertical-separator {
        height: 26px;
        width: 20px;
        border-left: 1px solid white;
      }
      .hamburger {
        cursor: pointer;
        div {
          width: 30px;
          height: 4px;
          background-color: white;
          margin: 4px 0;
        }
      }
    }
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
