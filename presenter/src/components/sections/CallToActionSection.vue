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
@import '#root/src/assets/scss/style';

.cta-section {
  max-width: $section-max-width-small;

  .section-header {
    text-align: center;

    h2.section-headline {
      @include section-content-headline-font;

      .prepend {
        color: $font-color-headline-prepend;
      }

      .append {
        color: $font-color-headline-append;
      }
    }
  }

  .section-content {
    @include section-content-font;

    text-align: center;
  }
}
</style>
