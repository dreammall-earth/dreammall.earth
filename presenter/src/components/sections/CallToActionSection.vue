<template>
  <div class="cta-section v-container pa-16">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          <span class="prepend">{{ $t('home.ctaSection.headline') }}</span
          >&nbsp;
          <span class="append">{{ $t('home.ctaSection.headlineAppend') }}</span>
        </h2>
      </v-col>
    </v-row>
    <v-row class="section-content">
      <v-col>
        <p>
          {{ $t('home.ctaSection.content') }}
        </p>
      </v-col>
    </v-row>
    <v-row class="section-footer text-center">
      <v-col>
        <MainButton
          class="mt-8"
          :label="$t('home.ctaSection.buttonText')"
          size="large"
          variant="primary"
          href="/#contactname"
          >{{ $t('home.ctaSection.buttonText') }}</MainButton
        >
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import MainButton from '#components/buttons/MainButton.vue'
</script>

<style scoped lang="scss">
.cta-section {
  max-width: 960px;

  .section-header {
    text-align: center;

    h2.section-headline {
      font-family: Poppins, sans-serif;
      font-size: 2.25rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.045rem;

      .prepend {
        color: #2ca5b1;
      }

      .append {
        color: #f09630;
      }
    }
  }

  .section-content {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    color: #3d4753;
    text-align: center;
  }
}
</style>
