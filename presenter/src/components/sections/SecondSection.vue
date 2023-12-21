<template>
  <div ref="target" class="px-4">
    <v-row class="section2 py-16">
      <v-col cols="12" md="7">
        <div class="section-left-part" :class="{ show: animate }">
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
            href="#contactname"
            >{{ $t('home.section2.buttonTxt') }}</MainButton
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
import MainButton from '#components/inputs/MainButton.vue'

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
      threshold: 0.5,
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
$mobile: 500px;
$tablet: 960px;

.section2 {
  max-width: 1440px;
  min-height: 50rem;
  color: #3d4753;
  background: #fff;

  h2.section-headline {
    font-family: Poppins, sans-serif;
    font-size: 3.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    text-transform: capitalize;

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

    @media screen and (max-width: $mobile) {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 3em;
    }
  }

  .section-content {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;

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
