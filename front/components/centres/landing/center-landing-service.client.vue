<template>
  <section id="services-overview">
    <div class="header">
      <vmc-header text="NOS SERVICES ESTHÉTIQUES" subtext="Confiez nous votre véhicule" />
    </div>
    <div class="services-list-wrapper">
      <div ref="servicesWrapperHtmlElement" class="services-list">
        <center-service-card
          v-for="(centerService, i) in servicesPreview"
          :id="centerService.id"
          :key="`service_${i}`"
          :title="centerService.title"
          :subtitle="centerService.subtitle"
          :picture="centerService.picture"
          :description="centerService.description"
          :min-price="centerService.prices?.priceTTC2Seats"
          theme="dark"
        />
      </div>

      <NuxtLink class="btn_see-all-services" to="/centres/services"><button class="btn_call-to-action">Voir tous les services</button></NuxtLink>

      <div class="contact-menu">
        <p class="text">Vous pouvez également proposer votre projet par téléphone ou par mail grâce aux coordonnées ci-dessous:</p>
        <div class="contact-links">
          <a class="text contact" href="tel:+33161391664"><font-awesome-icon :icon="['fas', 'phone']" style="color: #3DFFEB;" />01 61 39 16 64</a>
          <a class="text contact" href="mailto: contact@valuemycar.fr"
            ><font-awesome-icon :icon="['fas', 'envelope']" style="color: #3DFFEB;" />contact@valuemycar.fr</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const servicesWrapperHtmlElement = ref<HTMLElement>()
const servicesPreview: Ref<ICenterService[]> = ref([])

const wantedServicesTitle = ['Lavage exterieur & interieur', 'Car Staging', 'Polissage', 'Traitement céramique', 'Nettoyage Interieur']

/* Fetch services */
const fetchServices = async () => {
  const { data } = await useAPI().centerServices.getAllCenterServices()
  if (!data) return

  const { services } = data

  servicesPreview.value = services.filter((service) => wantedServicesTitle.includes(service.title))
}

onMounted(() => {
  fetchServices()
})
</script>

<style lang="scss" scoped>
#services-overview {
  h4 {
    text-transform: none;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 200px;
    height: 200px;
  }

  .services-list-wrapper {
    background-color: #0c1533;
    display: flex;
    flex-direction: column;
    box-shadow: inset 0 -50px 75px #00000095;

    .services-list {
      padding: 100px 50px 50px 50px;
      display: grid;
      justify-content: center;
      grid-template-columns: repeat(3, 280px);
      grid-gap: 50px;

      .service-card {
        transition: transform 0.5s;
      }
    }

    .contact-menu {
      padding: 100px 50px;
      width: 600px;

      a,
      p {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        color: #ffffff;
      }

      .contact-links {
        margin-top: 15px;
        .contact {
          color: #3dffeb;
          display: flex;
          flex-direction: row;
          gap: 10px;
          padding-top: 5px;
        }
      }
    }
  }
  .btn_see-all-services {
    margin: 0 auto;
    width: fit-content;
  }
}

@media screen and (max-width: 1040px) {
  #services-overview {
    .services-list-wrapper {
      .services-list {
        grid-template-columns: repeat(2, 280px);
      }
    }
  }
}

@media (max-width: 710px) {
  #services-overview {
    .header {
      padding-left: 20px;
    }

    .services-list-wrapper {
      .services-list {
        padding: 75px 20px;
        grid-template-columns: repeat(1, 280px);
      }

      .contact-menu {
        padding: 75px 20px;
        width: 100%;

        a,
        p {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
