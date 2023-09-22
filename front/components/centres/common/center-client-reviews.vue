<template>
  <section class="center-client-reviews">
    <!-- title -->
    <vmc-header class="title --desktop" text="NOS CLIENTS PARLENT DE NOUS" />
    <h4 class="title --mobile bold">NOS CLIENTS PARLENT DE NOUS</h4>

    <ul class="container-cards">
      <li v-for="(review, i) in reviewsToShow" :key="i" :class="`review-card fadeInUp-${i}`">
        <div class="review-card__head">
          <div v-if="review.profilePicture" class="review-card__head--img">
            <img :src="review.profilePicture" alt="" />
          </div>
          <div v-else class="review-card__head--inital">
            <div>{{ review.name[0] }}</div>
          </div>
          <div class="review-card__head--userInfo">
            <div class="userInfo-wrapper">
              <span class="reviewer-name">{{ review.name }}</span>
              <strong class="reviewer-average">
                <fa
                  v-for="n in 5"
                  :key="`reviewStar-${n}`"
                  :icon="`fa-${n <= review.rating ? 'solid' : 'regular'} fa-star`"
                  :width="11"
                  :height="11"
                />
              </strong>
            </div>
            <div class="date">{{ formatDate(review.date) }}</div>
          </div>
        </div>
        <div class="review-card__contains">
          <p>
            {{ review.contains }}
          </p>
        </div>
      </li>
    </ul>
    <button class="btn_functional" @click="showMore">
      {{ btnValue }}
    </button>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  reviews: {
    type: Array as PropType<ReviewerBoxCenter[]>,
    default: () => []
  }
})

// Convert format date
const formatDate = (dateToConvert: string) => {
  const dateArray = dateToConvert.split('/')
  const date = new Date(`2000-${dateArray[1]}-${dateArray[0]}`)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long'
  }
  return date.toLocaleDateString('fr-FR', options)
}

// Handle more or less reviews
const reviewsToShow = ref(props.reviews.slice(0, 3))
const btnValue = ref("Afficher plus d'avis")
const showMore = () => {
  if (reviewsToShow.value.length !== props.reviews.length) {
    const nextReviews = props.reviews.slice(reviewsToShow.value.length, reviewsToShow.value.length + 5)
    reviewsToShow.value.push(...nextReviews)
  } else {
    reviewsToShow.value = props.reviews.slice(0, 3)
  }

  if (reviewsToShow.value.length === props.reviews.length) {
    btnValue.value = "Afficher moins d'avis"
  } else {
    btnValue.value = "Afficher plus d'avis"
  }
}
</script>

<style lang="scss">
.center-client-reviews {
  padding: 100px clamp(20px, 25vw, 200px);

  .title.--mobile {
    display: none;
  }

  .container-cards {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .review-card {
      margin: 40px 0;
      &__head {
        display: flex;
        margin-bottom: 15px;
        &--img {
          // width: 35px;
          // height: 35px;
          &:first-child img {
            width: 35px;
            height: 35px;
            line-height: 0;
            object-fit: cover;
            align-self: center;
          }
        }
        &--inital {
          &:first-child div {
            width: 35px;
            height: 35px;
            text-align: center;
            font-family: 'Montserrat';
            font-size: 14px;
            line-height: 35px;
            background-color: #000;
            color: #fff;
          }
        }
        &--userInfo {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 10px;
          width: 100%;
          .userInfo-wrapper {
            display: flex;
            justify-content: space-between;
            .reviewer-name {
              font-family: 'Montserrat';
              font-weight: 600;
              font-size: 13px;
            }
            .reviewer-average {
              display: flex;
            }
          }
          .date {
            font-family: 'Nunito';
            font-size: 9px;
          }
        }
      }
      &__contains {
        p {
          text-align: start;
          font-family: 'Nunito';
          font-size: 12px;
          font-weight: 300;
          line-height: 14px;
        }
      }
    }
    @include fade-effect();
  }
}

@media screen and (max-width: 1000px) {
  .center-client-reviews {
    padding: 100px clamp(20px, 25vw, 75px);
  }
}

@media screen and (max-width: 700px) {
  .center-client-reviews {
    padding: 75px 20px;

    .title {
      &.--desktop {
        display: none;
      }
      &.--mobile {
        display: block;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .center-client-reviews {
    padding: 75px 20px;

    .title {
      margin-bottom: 25px;
    }
  }
}
</style>
