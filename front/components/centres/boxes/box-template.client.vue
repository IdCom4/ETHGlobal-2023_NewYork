<template>
  <section id="main-bg">
    <div id="left">
      <div class="container">
        <h2>{{ box.title }}</h2>
        <div class="horizontal-separator"></div>
        <span class="box-nb"
          >N°Box <span class="bold-italic">{{ box.names }}</span></span
        >
        <p class="description">{{ box.description }}</p>
        <a :href="box.redirectBox">
          <p class="show-more"><font-awesome-icon :icon="['fas', 'caret-right']" />En savoir plus</p>
        </a>
        <nuxt-link :to="box.redirectBox" class="link">
          <button class="btn btn_call-to-action">RESERVER CE BOX</button>
        </nuxt-link>
      </div>
    </div>
    <div id="right">
      <img :src="box.image" :alt="box.alt" />
    </div></section
></template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineProps({ box: { type: Object, default: () => ({}) } })

// const navigateToBooking = () => useRouter().push(`/centres/reservation/${props.box.category}`)
</script>

<style lang="scss" scoped>
#main-bg {
  width: 100%;
  height: 100vh;
  background-color: #0c1533;
  display: flex;
  flex-direction: row;
  div {
    width: 50%;
  }
  #left {
    box-shadow: inset 0px 60px 70px rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
      width: 100%;
      margin: 200px;
      h2,
      p,
      span {
        font-family: 'Montserrat';

        color: #ffffff;
      }
      h2 {
        font-weight: 700;
        font-style: italic;

        font-size: 57px;
      }
      p,
      span {
        margin-top: 50px;
        font-size: 19px;
      }
      .link {
        color: #000;
        .btn {
          margin-top: 50px;
        }
      }
      .box-nb {
        .bold-italic {
          margin-left: 30px;
          font-family: 'Montserrat';
          font-style: italic;
          font-weight: 800;
          font-size: 19px;
          line-height: 23px;
          word-spacing: 30px;
        }
      }

      .description {
        font-size: 17px;
      }
      .show-more {
        text-decoration: underline;
        cursor: pointer;
        :first-child {
          margin-right: 10px;
        }
      }
      .horizontal-separator {
        height: 20px;
        width: 300px;
        border-bottom: 3px solid rgba(61, 255, 235, 0.76);
        margin-bottom: 20px;
      }
      .vmc-btn {
        margin-top: 50px;
      }
    }
  }
  #right {
    // background-image: url('https://images.pexels.com/photos/244553/pexels-photo-244553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    // background-size: cover;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
@media (max-width: 1300px) {
  #main-bg {
    flex-direction: column;
    div {
      width: 100%;
    }
    #left {
      height: 50vh;
      .container {
        padding: 20px;
        .box-nb {
          margin-top: 20px;
        }
        h2 {
          font-size: 25px;
        }
        p {
          font-size: 11px;
        }
        .description {
          font-size: 11px;
          margin-top: 20px;
        }
        .show-more {
          margin-top: 20px;
        }
      }
    }
    #right {
      height: 50vh;
    }
  }
}
</style>
