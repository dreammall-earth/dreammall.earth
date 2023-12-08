<template>
  <div class="section5 pt-4 v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          <span class="prepend">{{ $t('home.section5.headline') }}</span
          >&nbsp;
          <span class="append">{{ $t('home.section5.headlineAppend') }}</span>
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-carousel hide-delimiter-background show-arrows="hover" color="#ABABAB" :height="650">
          <v-carousel-item draggable>
            <v-sheet rounded="xl" color="#F5F5F5" border :height="600">
              <div class="icon-container">
                <v-img class="w-100 slide-icon icon-1" :src="icon1" />
                <v-img class="w-100 slide-icon icon-2" :src="icon2" />
                <v-img class="w-100 slide-icon icon-3" :src="icon3" />

                <h3 class="w-100 slide-headline slide-headline-1">
                  {{ $t('home.section5.slide1.headline') }}
                </h3>
                <v-img class="w-100 icon-main main-slide-icon-1" :src="slideLogo1" />
                <h3 class="w-100 slide-subheadline slide-subheadline-1">
                  {{ $t('home.section5.slide1.subheadline') }}
                </h3>

                <v-img class="w-100 slide-icon icon-4" :src="icon4" />
                <v-img class="w-100 slide-icon icon-5" :src="icon5" />
                <v-img class="w-100 slide-icon icon-6" :src="icon6" />
              </div>
            </v-sheet>
          </v-carousel-item>

          <v-carousel-item draggable>
            <v-sheet rounded="xl" color="#F5F5F5" border :height="600">
              <div class="icon-container">
                <v-img class="w-100 slide-icon icon-1" :src="icon6" />
                <v-img class="w-100 slide-icon icon-2" :src="icon2" />
                <v-img class="w-100 slide-icon icon-3" :src="icon3" />

                <h3 class="w-100 slide-headline slide-headline-2">
                  {{ $t('home.section5.slide2.headline') }}
                </h3>
                <v-img class="w-100 icon-main main-slide-icon-2" :src="slideLogo2" />
                <h3 class="w-100 slide-subheadline slide-subheadline-2">
                  {{ $t('home.section5.slide2.subheadline') }}
                </h3>

                <v-img class="w-100 slide-icon icon-4" :src="icon8" />
                <v-img class="w-100 slide-icon icon-5" :src="icon5" />
                <v-img class="w-100 slide-icon icon-6" :src="icon1" />
              </div>
            </v-sheet>
          </v-carousel-item>

          <v-carousel-item draggable>
            <v-sheet rounded="xl" color="#F5F5F5" border :height="600">
              <div class="icon-container">
                <v-img class="w-100 slide-icon icon-1" :src="icon1" />
                <v-img class="w-100 slide-icon icon-2" :src="icon5" />
                <v-img class="w-100 slide-icon icon-3" :src="icon3" />

                <h3 class="w-100 slide-headline slide-headline-3">
                  {{ $t('home.section5.slide3.headline') }}
                </h3>
                <v-img class="w-100 icon-main main-slide-icon-3" :src="slideLogo3" />
                <h3 class="w-100 slide-subheadline slide-subheadline-3">
                  {{ $t('home.section5.slide3.subheadline') }}
                </h3>

                <v-img class="w-100 slide-icon icon-4" :src="icon4" />
                <v-img class="w-100 slide-icon icon-5" :src="icon2" />
                <v-img class="w-100 slide-icon icon-6" :src="icon7" />
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import icon1 from '#assets/img/slides/app_1.svg'
import icon7 from '#assets/img/slides/app_10.svg'
import icon2 from '#assets/img/slides/app_2.svg'
import icon3 from '#assets/img/slides/app_3.svg'
import icon4 from '#assets/img/slides/app_4.svg'
import icon5 from '#assets/img/slides/app_5.svg'
import icon6 from '#assets/img/slides/app_8.svg'
import icon8 from '#assets/img/slides/app_calendar.svg'
import slideLogo1 from '#assets/img/slides/slide1_logo.svg'
import slideLogo2 from '#assets/img/slides/slide2_logo.svg'
import slideLogo3 from '#assets/img/slides/slide3_logo.svg'
</script>

<style scoped lang="scss">
.section5 {
  max-width: 1120px;

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
        color: #f09630;
      }

      .append {
        color: #383838;
      }
    }
  }

  .icon-container {
    .slide-icon {
      position: absolute;
      max-width: 160px;

      &.icon-1 {
        top: 50px;
        left: 50px;
      }

      &.icon-2 {
        top: 250px;
        left: 200px;
      }

      &.icon-3 {
        top: 450px;
        left: 75px;
      }

      &.icon-4 {
        top: 60px;
        right: 50px;
      }

      &.icon-5 {
        top: 260px;
        right: 150px;
      }

      &.icon-6 {
        top: 440px;
        right: 40px;
      }
    }

    .icon-main {
      position: absolute;
      max-width: 80px;

      &.main-slide-icon-1 {
        top: 100px;
        right: calc(50% - 40px);
      }

      &.main-slide-icon-2 {
        top: 100px;
        right: calc(50% - 40px);
      }

      &.main-slide-icon-3 {
        top: 100px;
        right: calc(50% - 40px);
      }
    }

    .slide-headline {
      position: absolute;
      font-family: Poppins, sans-serif;
      font-size: 1.625rem;
      font-style: normal;
      font-weight: 600;
      line-height: 125%;
      text-align: center;
      background: linear-gradient(264deg, #35a3aa 28.43%, #e47a24 72.25%);
      -webkit-background-clip: text; /* stylelint-disable-line */
      background-clip: text;
      -webkit-text-fill-color: transparent;

      &.slide-headline-1 {
        top: 40px;
      }

      &.slide-headline-2 {
        top: 40px;
      }

      &.slide-headline-3 {
        top: 40px;
      }
    }

    .slide-subheadline {
      position: absolute;
      font-family: Poppins, sans-serif;
      font-size: 1.625rem;
      font-style: normal;
      font-weight: 600;
      line-height: 125%; /* 2.03125rem */
      color: #383838;
      text-align: center;
      text-transform: capitalize;

      &.slide-subheadline-1 {
        top: 240px;
      }

      &.slide-subheadline-2 {
        top: 240px;
      }

      &.slide-subheadline-3 {
        top: 240px;
      }
    }
  }
}
</style>
