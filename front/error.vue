<template>
  <user-alert />
  <login-modal />
  <!-- pages -->
  <navbar />

  <div class="main-content">
    <h2>404</h2>
    <p class="largest">La page que vous recherchez est introuvable, cliquez sur le bouton ci-dessous pour retourner à la page d'accueil</p>
    <p class="largest">Le site est actuellement en train d'accueillir une grande mise à jour.</p>
    <p class="largest">
      Certaines pages et fonctionnalités ne sont pour l'instant plus disponibles, mais reviendront bientôt plus belles et performantes que jamais
    </p>
    <NuxtLink to="/centres">
      <button class="btn_call-to-action">Accueil</button>
    </NuxtLink>
  </div>
  <bottombar-center book-link="/centres/reservation/WASHBOX" />
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

if (route.path.includes('rambouillet')) router.push('/centres')
</script>

<style scoped lang="scss">
h4 {
  text-align: center;
  font-weight: 700;
  margin: 10px 0px;
}

.main-content {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
  gap: 25px;
  width: 500px;
  max-width: calc(100% - 20px);

  p {
    text-align: center;
  }
}
</style>
