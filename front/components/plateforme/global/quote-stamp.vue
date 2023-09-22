<template>
  <div class="quote-stamp">
    <div class="square-box">
      <h4>{{ props.cardNumber }}</h4>
    </div>
    <div class="header">
      <nuxt-img class="user-pic" :src="props.userPic" loading="lazy" alt="" />
      <div class="header-info">
        <h4>DEVIS</h4>
        <p class="largest">{{ props.textQuote }}</p>
      </div>
    </div>
    <div class="stamp-content">
      <div class="workforce-equipment">
        <h5>Main d'oeuvre</h5>
        <div class="strip-spacing">
          <div></div>
          <div></div>
        </div>
        <div class="strip-spacing">
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="workforce-equipment">
        <h5>Pieces et produits</h5>
        <div class="strip-spacing">
          <div></div>
          <div></div>
        </div>
        <div class="strip-spacing">
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="total">
        <h5>Total</h5>
        <div></div>
      </div>
    </div>
    <p class="largest sent">Envoyer le devis</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  userPic: {
    type: String,
    default: '/'
  },
  cardNumber: {
    type: Number,
    default: 1
  },
  textQuote: {
    type: String,
    default: '/'
  }
})
</script>

<style lang="scss" scoped>
.quote-stamp {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border: 0.5px solid $black;
  background-color: $white;
  font-size: 1em;

  .header {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
    align-self: stretch;
    max-height: 20%;
    max-width: 100%;

    .user-pic {
      width: 35%;
      height: 100%;
      object-fit: cover;
    }
    .header-info {
      display: flex;
      padding: 0.5em 0px;
      width: 65%;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      align-self: stretch;
      h4 {
        font-size: 100%;
      }
      p {
        font-size: 75%;
      }
    }
  }
  p {
    font-size: 65%;
  }
  .stamp-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2em;
    .workforce-equipment {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8em;
      width: 100%;
      h5 {
        font-size: 65%;
      }
      .strip-spacing {
        display: inline-flex;
        align-items: flex-start;
        gap: 0.5em;
        width: 100%;
        div {
          background-color: $color-light-grey;
          height: 0.8em;
          flex: 2;
        }
        div:nth-child(2) {
          flex: 1;
        }
      }
    }
    .total {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      gap: 0.5em;
      div {
        background-color: $color-light-grey;
        width: 40%;
        height: 0.8em;
      }
      h5 {
        font-size: 65%;
        align-self: center;
      }
    }
  }
  .sent {
    text-decoration: underline;
    align-self: center;
  }
  h4,
  h5 {
    font-weight: bold;
    font-size: 65%;
  }
  .square-box {
    position: absolute;
    width: 1.9em;
    height: 1.9em;
    background-color: $white;
    border: 1px solid $black;

    transform: translate(0px, -140%);
    display: flex;
    align-items: center;
    justify-content: center;
    h4 {
      font-size: 100%;
    }
  }
}
</style>
