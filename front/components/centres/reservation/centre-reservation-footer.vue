<template>
  <section id="main-bg">
    <div class="container">
      <div class="footer-section">
        <div class="logo">
          <img src="https://vmc-static-contents.s3.eu-west-3.amazonaws.com/logos/02_ValueMyCar_LogotypeNegatif_RVB.png" />
        </div>
        <div class="socials">
          <a href="https://www.facebook.com/Valuemycar.centre/"> <fa :icon="['fab', 'facebook']" style="color: #ffffff;"/></a>
          <a href="https://www.instagram.com/valuemycar.rambouillet/?hl=fr"><fa :icon="['fab', 'instagram']" style="color: #ffffff;"/></a>
          <a href="https://www.linkedin.com/company/valuemycar-fr/"><fa :icon="['fab', 'linkedin']" style="color: #ffffff;"/></a>
          <a href="https://www.tiktok.com/@valuemycar.rambouillet"><fa :icon="['fab', 'tiktok']" style="color: #ffffff;"/></a>
          <a href="https://twitter.com/valuemycar_fr"><fa :icon="['fab', 'twitter']" style="color: #ffffff;"/></a>
          <a href="https://valuemycar.fr/rambouillet"><fa :icon="['fas', 'share-nodes']" style="color: #ffffff;"/></a>
        </div>
      </div>

      <div class="footer-section">
        <div class="description-mobile info">
          <p>
            ValueMyCar vous propose la location d'espace pour l'entretien esthétique et mécanique de votre auto ou votre moto. Nous avons trois types
            de boxe / Station de lavage - Box Mécanique - Box Détailing
          </p>
        </div>
        <div class="contact info">
          <p><fa :icon="['fas', 'location-dot']" />3 Rue Hélène Boucher, 78125 Gazeran</p>
          <p><fa :icon="['fas', 'clock']" />Horaires d'ouverture Lun - Dim : 9h30 - 18h30</p>
          <p><fa :icon="['fas', 'phone']" />01 61 39 16 64</p>
        </div>
        <div class="link info">
          <p>A propos</p>
          <p>Réserver un boxe</p>
          <p>Boxe mécanique</p>
          <p>Boxe detailing</p>
          <p>Boxe lavage</p>
          <p>Nos services</p>
          <p>Nos partenaires</p>
          <p>Les avis</p>
        </div>
        <div class="description info">
          <p>
            ValueMyCar vous propose la location d'espace pour l'entretien esthétique et mécanique de votre auto ou votre moto. Nous avons trois types
            de boxe / Station de lavage - Box Mécanique - Box Détailing
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
#main-bg {
  height: 60vh;
  background-color: #0c1533;
  display: flex;
  align-items: left;
  justify-content: center;
  p {
    color: white;
  }
  .container {
    width: 1000px;
    margin-top: 100px;
    .footer-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 30px;
      .logo {
        height: 40px;
        position: relative;
        img {
          height: 100%;
        }
        p {
          position: absolute;
          color: white;
          bottom: 8px;
          right: -75px;
          font-size: 12px;
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
      .info {
        width: 30%;
      }
      .contact {
        p {
          line-height: 20px;
          svg {
            margin-right: 15px;
          }
        }
      }
      .description-mobile {
        display: none;
      }
      .link {
        line-height: 34px;
      }
    }
  }
}
@media (max-width: 1050px) {
  #main-bg {
    height: unset;
    .container {
      margin-top: 0px;
      .footer-section {
        flex-direction: column;
        padding: 25px;
        margin-bottom: 0;
        gap: 30px;
        .info {
          width: 100%;
        }
        .description {
          display: none;
        }
        .description-mobile {
          display: block;
        }
        .socials {
          width: unset;
        }
        .contact {
          p {
          }
        }
      }
    }
  }
}
</style>
