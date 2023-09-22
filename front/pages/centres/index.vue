<template>
  <section id="home-page">
    <center-landing-main />
    <center-landing-reservation />
    <center-landing-service />
    <center-landing-equipments />
    <center-landing-find-us></center-landing-find-us>
    <center-landing-center />
    <center-client-reviews :reviews="reviews" />
  </section>
</template>

<script setup lang="ts">
import { GlobalEventTypes } from '@/types/constants'

onMounted(() => {
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_NAVBAR_THEME, 'light')
  useGlobalEvents().emitEvent(GlobalEventTypes.UPDATE_FOOTER_THEME, 'dark')
})

const reviews: Ref<ReviewerBoxCenter[]> = ref([])

reviews.value = [
  {
    name: 'Julie Rocca',
    date: '12/10',
    rating: 5,
    contains:
      'Super centre, doté d’équipements de qualité. Les employés sont de bon conseils si nous avons des questions sur la mécanique et nous assistent si besoin. Je recommande!'
  },
  {
    name: 'Ilkan Pala',
    date: '08/06',
    rating: 5,
    contains:
      "Super Centre automobile pour faire de la mécanique soit même ou lavage/detailing. Les outils sont fournis et de très bonne qualité. J'ai pu effectuer la vidange + changement des filtres + changement des supports moteur sans problème sur mon véhicule. Sans oublier l'accueil au top ! Merci ValuemyCar Rambouillet !!"
  },
  {
    name: 'adam amabaye',
    date: '16/10',
    rating: 5,
    contains:
      'Cela vaux vraiment le detour, le matériel mecanique est très complet et la partie lavage vous rend la voiture véritablement neuve. veridique'
  },
  {
    name: 'Sarah',
    date: '22/06',
    rating: 5,
    contains:
      "Je recommande fortement ce centre d'entretien automobile ! Le conseiller est bienveillant et à notre écoute. Les équipements sont de très bonne qualité et les locaux sont très propres. Allez-y les yeux fermés !"
  },
  {
    name: 'Ersel Pala',
    date: '10/05',
    rating: 5,
    contains:
      "Le concept est génial ! Un garage ou l'on peut s'occuper de son véhicule pratiquement de A à Z (nettoyage, detailing, mécanique ...) Venue pour un changement de support moteur et une révisions, j'ai donc loué un box mécanique. Tout les outils nécessaires son mis à disposition pour tout type de travaux et c'est du matériel de très bonne qualité. Un très bon accueil, le gérant est sympa et ne manque pas de professionnalisme. C'était un plaisir ! Je reviendrai sans hésitation."
  },
  {
    name: 'michel julien',
    date: '28/09',
    rating: 5,
    contains:
      "Très bon accueil et conseils, locaux propre et fonctionnel, le rapport qualité /prix est imbattable, ils ont des produits de qualités (la cire est superbe) tout comme les équipements, le concept est super, ça change des stations classique ou l'on doit se presser !! je reviendrais pour un lustrage !"
  }
]
</script>

<style lang="scss"></style>
