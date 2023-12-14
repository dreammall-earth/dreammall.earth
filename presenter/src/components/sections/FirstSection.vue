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
              :poster="VideoPoster"
              autoplay
              muted
              preload="auto"
              playsinline
              @ended="triggerNextSlide"
              @click="playVideo"
            >
              <source :src="videoSrc" type="video/mp4" />
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

import VideoPoster from '#assets/img/video_placeholder.png'
import Video from '#assets/video/header_video.mp4'
import VideoMobile from '#assets/video/header_video_mobile.mp4'
import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'

const slide = ref(0)
const video = ref<HTMLFormElement>()
const videoSrc = ref('')

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
    videoSrc.value = VideoMobile
  } else {
    videoSrc.value = Video
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
