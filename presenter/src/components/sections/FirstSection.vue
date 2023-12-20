<template>
  <div class="">
    <div class="section1">
      <v-carousel
        v-model="slide"
        class="h-screen landing-slider"
        hide-delimiter-background
        show-arrows="hover"
        color="#ffffff"
        theme="dark"
      >
        <v-carousel-item class="video-item">
          <v-sheet class="video-item">
            <video
              :key="videoSrc"
              ref="video"
              class="video w-100"
              :poster="posterSrc"
              autoplay
              muted
              preload="auto"
              playsinline
              @ended="triggerNextSlide"
              @click="playVideo"
            >
              <source :src="videoSrc" type="video/mp4" />
              <source :src="videoSrcAlt" type="video/webm" />
            </video>
          </v-sheet>
        </v-carousel-item>

        <v-carousel-item>
          <v-sheet
            color="transparent"
            class="content-slide d-flex flex-column justify-center align-center text-center"
          >
            <p class="section-headline mt-16">{{ $t('home.section1.headline') }}</p>
            <div class="w-100 mt-16 d-flex justify-center">
              <LogoImage size="large" />
            </div>
            <p class="section-subheadline mt-16">
              {{ $t('home.section1.subHeadline') }}
            </p>
            <MainButton
              class="mt-8"
              :label="$t('home.section1.preOrderBtn')"
              size="auto"
              variant="primary"
              href="#about"
              >{{ $t('home.section1.preOrderBtn') }}</MainButton
            >
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import VideoMobileMp4 from '#assets/video/intro_hoch.mp4'
import VideoMobileWebm from '#assets/video/intro_hoch.webm'
import VideoMp4 from '#assets/video/intro_quer.mp4'
import VideoWebm from '#assets/video/intro_quer.webm'
import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import VideoPosterMobile from '#assets/img/intro_thumbnail_hoch.jpg'
import VideoPoster from '#assets/img/intro_thumbnail_quer.jpg'

const slide = ref(0)
const video = ref<HTMLFormElement>()
const videoSrc = ref('')
const videoSrcAlt = ref('')
const posterSrc = ref('')

const mobileThreshold: number = 550

defineExpose({ slide })

function triggerNextSlide() {
  slide.value++
}

function playVideo() {
  if (video.value && video.value.ended) {
    video.value.play()
  }
}

function isMobile() {
  return window.innerWidth <= mobileThreshold
}

function setVideoSrc() {
  if (isMobile()) {
    videoSrc.value = VideoMobileMp4
    videoSrcAlt.value = VideoMobileWebm
    posterSrc.value = VideoPosterMobile
  } else {
    videoSrc.value = VideoMp4
    videoSrcAlt.value = VideoWebm
    posterSrc.value = VideoPoster
  }
}

onMounted(() => {
  setVideoSrc()
  window.addEventListener('resize', () => {
    setVideoSrc()
  })
})
</script>

<style scoped lang="scss">
.section1 {
  background: linear-gradient(0deg, #f5f5f5 0.06%, #d8d8d8 100%);

  .section-headline {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-weight: 300;
    line-height: 1.875;
    color: #3d4753;
  }

  .section-subheadline {
    font-family: Poppins, sans-serif;
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.6875;
    color: #797979;
  }

  .content-slide {
    padding: 4rem 2rem 2rem;
  }
}
</style>

<style lang="scss">
.section1 {
  .v-carousel {
    background: transparent;

    .v-carousel-item {
      &:first-child {
        .v-responsive__content {
          align-self: center;
        }
      }
    }
  }

  .v-window__controls {
    .v-btn {
      .v-btn__underlay {
        background: rgb(255 255 255 / 15%);
        backdrop-filter: blur(14px);
        border-radius: 2.5rem;
      }
    }
  }
}
</style>
