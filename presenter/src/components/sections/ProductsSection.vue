<template>
  <div class="products-section v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          <span class="prepend">{{ $t('home.productsSection.headline') }}</span>
          <span class="append">{{ $t('home.productsSection.headlineAppend') }}</span>
        </h2>
      </v-col>
    </v-row>
    <v-row class="mt-12 card-row justify-space-around">
      <v-col cols="12" md="3" class="d-flex justify-center pa-0">
        <section-column-card
          :image-src="MallIcon"
          :card-title="$t('home.productsSection.firstColumn.headline')"
          :card-text="$t('home.productsSection.firstColumn.text')"
        ></section-column-card>
      </v-col>
      <v-col cols="12" md="3" class="d-flex justify-center pa-0">
        <section-column-card
          :image-src="CoffeeLogo"
          :card-title="$t('home.productsSection.secondColumn.headline')"
          :card-text="$t('home.productsSection.secondColumn.text')"
        ></section-column-card>
      </v-col>
      <v-col cols="12" md="3" class="d-flex justify-center pa-0">
        <section-column-card
          :image-src="MenschenProjekteIcon"
          :card-title="$t('home.productsSection.thirdColumn.headline')"
          :card-text="$t('home.productsSection.thirdColumn.text')"
        ></section-column-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import CoffeeLogo from '#assets/img/coffee_icon.svg'
import MallIcon from '#assets/img/logo_mall.svg'
import MenschenProjekteIcon from '#assets/img/menschen_projekte.svg'
import SectionColumnCard from '#components/layout/SectionColumnCard.vue'
</script>

<script lang="ts" setup></script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.products-section {
  max-width: $section-max-width-x-big;

  .section-header {
    text-align: center;

    h2.section-headline {
      @include section-content-headline;

      .prepend {
        color: $font-color-headline-prepend;
      }

      .append {
        color: $font-color-headline-append;
      }
    }
  }

  .card-row {
    width: 100%;
    max-width: 1248px;
  }
}
</style>
