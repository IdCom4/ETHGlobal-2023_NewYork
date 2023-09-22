<template>
  <div class="button-flex">
    <a><p class="click-tab">Nos boxes</p></a>
    <a><p class="click-tab">Boutique</p></a>
    <a><p class="click-tab">Evenements</p></a>
    <button class="vmc-btn --neon-blue">ME CONNECTER</button>
    <button class="vmc-btn --white">CREER UN COMPTE</button>
    <div class="vertical-separator"></div>
    <hamburger />
  </div>
</template>
<style lang="scss" scoped>
.button-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  .click-tab {
    font-size: 20px;
    color: white;
    padding: 0 20px 0 20px;
    font-weight: bold;
    cursor: pointer;
    user-select: none; /* Standard syntax */
  }
  .vertical-separator {
    height: 35px;
    width: 20px;
    border-left: 1px solid white;
  }
  .hamburger {
    cursor: pointer;
    div {
      width: 35px;
      height: 5px;
      background-color: white;
      margin: 6px 0;
    }
  }
}
</style>
