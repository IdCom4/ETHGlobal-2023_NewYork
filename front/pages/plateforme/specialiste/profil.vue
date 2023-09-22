<template>
  <section id="professional-profile-page">
    <professional-header />
    <div class="container">
      <professional-presentation />

      <div class="wrapper">
        <div class="flex left-side">
          <professional-company id="professional_company" />
          <professional-payment-info id="professional_payment-info" />
          <professional-insurance id="professional_insurance" />
          <professional-cv id="professional_cv" />
        </div>
        <div class="flex right-side">
          <professional-skills id="professional_skills" />
          <professional-realisations id="professional_realizations" />
          <professional-experiences />
          <professional-studies />
          <professional-reviews-block id="professional_review" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
section#professional-profile-page {
  margin-bottom: 20px;
  justify-content: center;
}

.container {
  max-width: 1220px;
  margin: auto;
}
.wrapper {
  // margin-top: $spacing-5;
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1220px;
  margin: auto;
  padding: 50px 20px;
}

#professional_company {
  grid-area: company;
}
#professional_payment-info {
  grid-area: paymentInfo;
}
#professional_insurance {
  grid-area: insurance;
}
#professional_cv {
  grid-area: cv;
}
#professional_skills {
  grid-area: skills;
}
#professional_realizations {
  grid-area: realizations;
}
#professional_experiences {
  grid-area: experiences;
}
#professional_studies {
  grid-area: studies;
}
#professional_review {
  grid-area: review;
}

.flex {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-side {
  width: 360px;
}

.right-side {
  width: 100%;
}

@media (max-width: 900px) {
  section#user-profile-page {
    margin: 0;
  }
  .wrapper {
    flex-direction: column;
    gap: 0;
    padding: 0;
  }
  .left-side {
    width: 100%;
  }

  .flex {
    gap: 0;
  }
}
</style>
