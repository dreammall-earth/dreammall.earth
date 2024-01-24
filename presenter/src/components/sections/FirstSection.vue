<template>
  <div class="h-100">
    <div class="section1 h-100">
      <v-carousel
        v-model="slide"
        class="landing-slider"
        hide-delimiter-background
        show-arrows="hover"
        color="#ffffff"
        height="100%"
      >
        <v-carousel-item id="intro-video-slide" class="video-item">
          <v-sheet color="transparent" class="video-item h-100">
            <video
              :key="videoSrc"
              ref="video"
              class="video w-100 h-100"
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
              href="/#about"
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

import VideoPosterMobile from '#assets/img/intro_thumbnail_hoch.jpg'
import VideoPoster from '#assets/img/intro_thumbnail_quer.jpg'
import VideoMobileMp4 from '#assets/video/intro_hoch.mp4'
import VideoMobileWebm from '#assets/video/intro_hoch.webm'
import VideoMp4 from '#assets/video/intro_quer.mp4'
import VideoWebm from '#assets/video/intro_quer.webm'
import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'

const slide = ref(0)
const video = ref<HTMLFormElement>()
const videoSrc = ref('')
const videoSrcAlt = ref('')
const posterSrc = ref('')

const mobileThreshold: number = 750

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

const videoSrcControl = {
  setVideoSrc() {
    if (isMobile()) {
      videoSrc.value = VideoMobileMp4
      videoSrcAlt.value = VideoMobileWebm
      posterSrc.value = VideoPosterMobile
    } else {
      videoSrc.value = VideoMp4
      videoSrcAlt.value = VideoWebm
      posterSrc.value = VideoPoster
    }
  },
}

onMounted(() => {
  videoSrcControl.setVideoSrc()
  window.addEventListener('resize', () => {
    videoSrcControl.setVideoSrc()
  })
})
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.section1 {
  background: linear-gradient(
    0deg,
    $background-color-primary 0.06%,
    $background-color-primary-transition 100%
  );

  .section-headline {
    font-family: $font-family-default;
    font-size: 1.25rem;
    font-weight: 300;
    line-height: 1.875;
    color: $font-color-default;
  }

  .section-subheadline {
    font-family: $font-family-default;
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.6875;
    color: $font-color-section-subheadline;
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
        video {
          position: absolute;
          right: 0;
          bottom: 0;
          min-width: 100%;
          min-height: 100%;
          object-fit: fill;
        }
      }
    }
  }
}
</style>
