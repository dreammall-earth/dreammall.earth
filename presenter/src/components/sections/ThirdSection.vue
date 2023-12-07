<template>
  <div class="section3">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          <span class="prepend">{{ $t('home.section3.headline') }}</span>
          <span class="append">{{ $t('home.section3.headlineAppend') }}</span>
        </h2>
      </v-col>
    </v-row>
    <v-row class="mt-12 card-row">
      <v-col>
        <section-column-card
          :image-src="MallIcon"
          :card-title="$t('home.section3.firstColumn.headline')"
          :card-text="$t('home.section3.firstColumn.text')"
        ></section-column-card>
      </v-col>
      <v-col>
        <section-column-card
          :image-src="CoffeeLogo"
          :card-title="$t('home.section3.secondColumn.headline')"
          :card-text="$t('home.section3.secondColumn.text')"
        ></section-column-card>
      </v-col>
      <v-col>
        <section-column-card
          :image-src="MenschenProjekteIcon"
          :card-title="$t('home.section3.thirdColumn.headline')"
          :card-text="$t('home.section3.thirdColumn.text')"
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
.section3 {
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
        color: #383838;
      }
    }
  }
}
</style>
