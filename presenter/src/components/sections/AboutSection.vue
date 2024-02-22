<template>
  <div ref="target" class="px-4">
    <v-row class="about-section py-16">
      <v-col cols="12" md="7">
        <div class="section-left-part" :class="{ show: animate }">
          <h2 class="section-headline">
            {{ $t('home.aboutSection.headline') }}
          </h2>
          <p class="section-content mt-8">
            {{ $t('home.aboutSection.contentFirstParagraph') }}
          </p>
          <p class="section-content">
            {{ $t('home.aboutSection.contentSecondParagraph') }}
          </p>

          <MainButton
            class="mt-8"
            :label="$t('home.aboutSection.buttonTxt')"
            size="auto"
            variant="fourth"
            href="/#contactname"
            >{{ $t('home.aboutSection.buttonTxt') }}</MainButton
          >
        </div>
      </v-col>
      <v-col align-self="center" cols="12" md="5" class="d-flex justify-center align-center">
        <div class="section-right-part w-100" :class="{ show: animate }">
          <v-img class="section-logo ma-2 pa-1 w-100" :src="LogoPlain" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue'

import LogoPlain from '#assets/dreammall-logo-plain.svg'
import MainButton from '#components/buttons/MainButton.vue'

const target = ref()
const animate = ref(false)
let observer: IntersectionObserver

onBeforeMount(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      animate.value = entry.isIntersecting
      if (animate.value) {
        observer.disconnect()
      }
    },
    {
      threshold: 0.3,
    },
  )
})
onMounted(() => {
  if (observer) {
    observer.observe(target.value)
  }
})
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.about-section {
  max-width: $section-max-width-big;
  min-height: 50rem;
  color: $font-color-default;
  background: $background-color-alt;

  h2.section-headline {
    @include text-font-headline;

    @media screen and (max-width: $mobile) {
      font-size: 3rem;
    }
  }

  .section-left-part {
    transition: 2s cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translateX(-200%);

    &.show {
      transform: translateX(0%);
    }

    @media screen and (max-width: $mobile) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .section-right-part {
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translateX(200%) rotate(180deg);

    &.show {
      transform: rotate(0deg) translateX(0%);
    }

    @media screen and (max-width: $tablet) {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 3em;
    }
  }

  .section-content {
    @include section-content-font;

    @media screen and (max-width: $mobile) {
      padding: 10px;
    }
  }

  .section-logo {
    max-width: 24.7268rem;

    @media screen and (max-width: $mobile) {
      max-width: 10.5rem;
      padding: 10px;
    }
  }
}
</style>
