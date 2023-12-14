<template>
  <v-row class="section2 py-16">
    <v-col cols="12" md="7">
      <h2 class="section-headline">
        {{ $t('home.section2.headline') }}
      </h2>
      <p class="section-content mt-8">
        {{ $t('home.section2.contentFirstParagraph') }}
      </p>
      <p class="section-content">
        {{ $t('home.section2.contentSecondParagraph') }}
      </p>

      <MainButton
        class="mt-8"
        :label="$t('home.section2.buttonTxt')"
        size="auto"
        variant="fourth"
        >{{ $t('home.section2.buttonTxt') }}</MainButton
      >
    </v-col>
    <v-col align-self="center" cols="12" md="5" class="d-flex justify-center align-center">
      <v-img class="section-logo mt-8 mt-md-2 ma-2 pa-1 w-100" :src="LogoPlain" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import LogoPlain from '#assets/dreammall-logo-plain.svg'
import MainButton from '#components/inputs/MainButton.vue'
</script>

<style scoped lang="scss">
.section2 {
  max-width: 1440px;
  color: #3d4753;
  background: #fff;

  h2.section-headline {
    font-family: Poppins, sans-serif;
    font-size: 3.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    text-transform: capitalize;
  }

  .section-content {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  }

  .section-logo {
    max-width: 24.7268rem;
  }
}
</style>
