<template>
  <div class="coffee-section pt-4 v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          <span class="prepend">{{ $t('home.coffeeSection.headline') }}</span
          >&nbsp;
          <span class="append">{{ $t('home.coffeeSection.headlineAppend') }}</span>
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-hover v-slot="{ isHovering, props }">
          <v-carousel
            v-bind="props"
            hide-delimiter-background
            :cycle="!isHovering"
            show-arrows="hover"
            color="#ABABAB"
            :height="650"
          >
            <v-carousel-item draggable>
              <v-sheet rounded="xl" color="#FFF" border :height="600">
                <div class="icon-container slide1">
                  <v-img class="w-100 icon-main main-slide-icon-1" :src="slideLogo1" />
                  <h3 class="w-100 slide-subheadline slide-subheadline-1">
                    {{ $t('home.coffeeSection.slide1.subheadline') }}
                  </h3>
                  <h3 class="w-100 slide-headline slide-headline-1">
                    {{ $t('home.coffeeSection.slide1.headline') }}
                  </h3>

                  <v-img class="w-100 slide-icon icon-1" :src="slide1Icon1" />
                  <v-img class="w-100 slide-icon icon-2" :src="slide1Icon2" />
                  <v-img class="w-100 slide-icon icon-3" :src="slide1Icon3" />
                  <v-img class="w-100 slide-icon icon-4" :src="slide1Icon4" />
                  <v-img class="w-100 slide-icon icon-5" :src="slide1Icon5" />
                </div>
              </v-sheet>
            </v-carousel-item>

            <v-carousel-item draggable>
              <v-sheet rounded="xl" color="#FFF" border :height="600">
                <div class="icon-container slide2">
                  <v-img class="w-100 icon-main main-slide-icon-2" :src="slideLogo2" />
                  <h3 class="w-100 slide-subheadline slide-subheadline-2">
                    {{ $t('home.coffeeSection.slide2.subheadline') }}
                  </h3>
                  <h3 class="w-100 slide-headline slide-headline-2">
                    {{ $t('home.coffeeSection.slide2.headline') }}
                  </h3>

                  <v-img class="w-100 slide-icon icon-1" :src="slide2Icon1" />
                  <v-img class="w-100 slide-icon icon-2" :src="slide2Icon2" />
                  <v-img class="w-100 slide-icon icon-3" :src="slide2Icon3" />
                  <v-img class="w-100 slide-icon icon-4" :src="slide2Icon4" />
                </div>
              </v-sheet>
            </v-carousel-item>

            <v-carousel-item draggable>
              <v-sheet rounded="xl" color="#FFF" border :height="600">
                <div class="icon-container slide3">
                  <h3 class="w-100 slide-subheadline slide-subheadline-3">
                    {{ $t('home.coffeeSection.slide3.subheadline') }}
                  </h3>
                  <h3 class="w-100 slide-headline slide-headline-3">
                    {{ $t('home.coffeeSection.slide3.headline') }}
                  </h3>
                  <v-img class="w-100 icon-main main-slide-icon-3" :src="slideLogo3" />

                  <v-img class="w-100 slide-icon icon-1" :src="slide3Icon1" />
                  <v-img class="w-100 slide-icon icon-2" :src="slide3Icon2" />
                  <v-img class="w-100 slide-icon icon-3" :src="slide3Icon3" />
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import slide1Icon4 from '#assets/img/slides/slide1-calendar.svg'
import slide1Icon5 from '#assets/img/slides/slide1-link-based.svg'
import slideLogo1 from '#assets/img/slides/slide1-logo.svg'
import slide1Icon3 from '#assets/img/slides/slide1-presentation.svg'
import slide1Icon1 from '#assets/img/slides/slide1-social.svg'
import slide1Icon2 from '#assets/img/slides/slide1-video-conf.svg'
import slideLogo2 from '#assets/img/slides/slide2-logo.svg'
import slide2Icon1 from '#assets/img/slides/slide2-presenter.svg'
import slide2Icon4 from '#assets/img/slides/slide2-selling.svg'
import slide2Icon3 from '#assets/img/slides/slide2-shops.svg'
import slide2Icon2 from '#assets/img/slides/slide2-trade.svg'
import slide3Icon2 from '#assets/img/slides/slide3-dashboard.svg'
import slide3Icon1 from '#assets/img/slides/slide3-invitation.svg'
import slideLogo3 from '#assets/img/slides/slide3-logo.svg'
import slide3Icon3 from '#assets/img/slides/slide3-search.svg'
</script>

<style scoped lang="scss">
$mobile: 500px;
$tablet: 960px;

.coffee-section {
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

        @media screen and (max-width: $tablet) {
          white-space: nowrap;
        }
      }
    }
  }

  .icon-container {
    &.slide1 {
      .slide-icon {
        position: absolute;
        max-width: 150px;
        transform: scale(0.9);

        @media screen and (max-width: $tablet) {
          max-width: 100px;
        }

        @media screen and (max-width: $mobile) {
          max-width: 90px;
        }

        &.icon-1 {
          top: 370px;
          left: 50px;

          @media screen and (max-width: $tablet) {
            top: 350px;
            left: 10%;
          }

          @media screen and (max-width: $mobile) {
            top: 360px;
            left: 10%;
          }
        }

        &.icon-2 {
          top: 320px;
          left: 240px;

          @media screen and (max-width: $tablet) {
            top: 460px;
            left: 20%;
          }

          @media screen and (max-width: $mobile) {
            left: 15%;
          }
        }

        &.icon-3 {
          top: 320px;
          right: 0;
          left: 0;
          margin-right: auto;
          margin-left: auto;
          transform: scale(1.2);

          @media screen and (max-width: $tablet) {
            top: 395px;
            transform: scale(1.2);
          }
        }

        &.icon-4 {
          top: 320px;
          right: 240px;

          @media screen and (max-width: $tablet) {
            top: 320px;
            right: 15%;
          }

          @media screen and (max-width: $mobile) {
            top: 330px;
            right: 17%;
          }
        }

        &.icon-5 {
          top: 385px;
          right: 50px;
          transform: scale(1.2);

          @media screen and (max-width: $tablet) {
            top: 460px;
            right: 15%;
            transform: scale(1.2);
          }

          @media screen and (max-width: $mobile) {
            right: 10%;
          }
        }
      }
    }

    &.slide2 {
      .slide-icon {
        position: absolute;
        max-width: 130px;

        @media screen and (max-width: $tablet) {
          max-width: 100px;
        }

        @media screen and (max-width: $mobile) {
          max-width: 80px;
        }

        &.icon-1 {
          top: 350px;
          left: 180px;

          @media screen and (max-width: $tablet) {
            top: 380px;
            left: 10%;
          }

          @media screen and (max-width: $mobile) {
            left: 5%;
          }
        }

        &.icon-2 {
          top: 320px;
          left: 370px;

          @media screen and (max-width: $tablet) {
            top: 350px;
            left: 30%;
          }

          @media screen and (max-width: $mobile) {
            left: 27%;
          }
        }

        &.icon-3 {
          top: 320px;
          right: 370px;

          @media screen and (max-width: $tablet) {
            top: 350px;
            right: 30%;
          }

          @media screen and (max-width: $mobile) {
            right: 27%;
          }
        }

        &.icon-4 {
          top: 350px;
          right: 180px;

          @media screen and (max-width: $tablet) {
            top: 380px;
            right: 10%;
          }

          @media screen and (max-width: $mobile) {
            right: 5%;
          }
        }
      }
    }

    &.slide3 {
      .slide-icon {
        position: absolute;
        max-width: 130px;

        @media screen and (max-width: $tablet) {
          max-width: 100px;
        }

        @media screen and (max-width: $mobile) {
          max-width: 90px;
        }

        &.icon-1 {
          top: 300px;
          left: 120px;

          @media screen and (max-width: $tablet) {
            top: 370px;
            left: 10%;
          }

          @media screen and (max-width: $mobile) {
            left: 5%;
          }
        }

        &.icon-2 {
          top: 350px;
          right: 0;
          left: 0;
          margin-right: auto;
          margin-left: auto;

          @media screen and (max-width: $tablet) {
            top: 420px;
          }
        }

        &.icon-3 {
          top: 300px;
          right: 120px;

          @media screen and (max-width: $tablet) {
            top: 370px;
            right: 10%;
          }

          @media screen and (max-width: $mobile) {
            right: 5%;
          }
        }
      }
    }
  }

  .icon-main {
    position: absolute;
    max-width: 60px;

    &.main-slide-icon-1 {
      top: 60px;
      right: calc(50% - 30px);
    }

    &.main-slide-icon-2 {
      top: 60px;
      right: calc(50% - 60px);
      max-width: 120px;
    }

    &.main-slide-icon-3 {
      top: 60px;
      right: calc(50% - 45px);
      max-width: 90px;
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

    @media screen and (max-width: $mobile) {
      font-size: 140%;
    }

    &.slide-headline-1 {
      top: 220px;
    }

    &.slide-headline-2 {
      top: 220px;
    }

    &.slide-headline-3 {
      top: 220px;
      right: 0;
      left: 0;
      max-width: 560px;
      margin-right: auto;
      margin-left: auto;
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
      top: 160px;
    }

    &.slide-subheadline-2 {
      top: 160px;
    }

    &.slide-subheadline-3 {
      top: 160px;
    }
  }
}
</style>
