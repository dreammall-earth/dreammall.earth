<template>
  <div class="newsletter-section pt-4 v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          {{ $t('home.newsletterSection.headline') }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="section-subheadline">
          {{ $t('home.newsletterSection.subHeadline') }}
        </h3>
        <div class="mt-8">
          <NewsletterForm />
        </div>
      </v-col>
    </v-row>
    <!-- <v-row class="mt-12" align="center">
      <v-col cols="5">
        <h3 class="section-subheadline">
          {{ $t('home.newsletterSection.currentNewsletter') }}
        </h3>
      </v-col>
      <v-col cols="7">
        <MainButton
          variant="download"
          size="auto"
          :label="$t('home.newsletterSection.newsletterDownloadBtn')"
          type="submit"
          download
          :href="newsletterDownloadPath"
        >
        </MainButton>
      </v-col>
    </v-row> -->
  </div>
</template>

<script lang="ts" setup>
// import MainButton from '#components/buttons/MainButton.vue'
import NewsletterForm from '#components/forms/NewsletterForm.vue'

// TODO insert link to newest newsletter
// const newsletterDownloadPath = '#'
</script>

<style scoped lang="scss">
.newsletter-section {
  max-width: 650px;

  .section-header {
    text-align: center;

    h2.section-headline {
      font-family: Poppins, sans-serif;
      font-size: 2.25rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.045rem;
      background: linear-gradient(255deg, #3d4753 23.75%, #e47a24 66.34%);
      -webkit-background-clip: text; /* stylelint-disable-line */
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  h3.section-subheadline {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    color: #3d4753;
  }
}
</style>
