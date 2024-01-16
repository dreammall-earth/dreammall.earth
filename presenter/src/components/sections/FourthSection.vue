<template>
  <div class="section4 v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          {{ $t('home.section4.headline') }}
        </h2>
      </v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <video
          :key="videoSrc"
          ref="video"
          class="video w-100"
          :poster="posterSrc"
          autoplay
          muted
          preload="auto"
          playsinline
          @ended="triggerButtonVisibility"
        >
          <source :src="videoSrc" type="video/mp4" />
          <source :src="videoSrcAlt" type="video/webm" />
        </video>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="anim-btn-col text-center">
        <Transition>
          <MainButton
            v-if="showButton"
            class="mt-8 anim-btn"
            :label="$t('home.section4.timelineBtn')"
            size="auto"
            variant="reload"
            @click="playVideo"
          ></MainButton>
        </Transition>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import VideoPosterMobile from '#assets/img/timeline_thumbnail_hoch.jpg'
import VideoPoster from '#assets/img/timeline_thumbnail_quer.jpg'
import VideoMobileMp4 from '#assets/video/timeline_hoch.mp4'
import VideoMobileWebm from '#assets/video/timeline_hoch.webm'
import VideoMp4 from '#assets/video/timeline_quer.mp4'
import VideoWebm from '#assets/video/timeline_quer.webm'
import MainButton from '#components/inputs/MainButton.vue'

const showButton = ref(false)
const video = ref<HTMLFormElement>()
const videoSrc = ref('')
const videoSrcAlt = ref('')
const posterSrc = ref('')

const mobileThreshold: number = 550

function triggerButtonVisibility() {
  showButton.value = true
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
$mobile: 500px;
$tablet: 960px;

.section4 {
  max-width: 1140px;
  background: #f5f5f5;

  .section-header {
    text-align: center;

    h2.section-headline {
      font-family: Poppins, sans-serif;
      font-size: 2.25rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.045rem;
      background: linear-gradient(255deg, #2ca5b1 23.75%, #e47a24 66.34%);
      -webkit-background-clip: text; /* stylelint-disable-line */
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .anim-btn-col {
    min-height: 8rem;

    .anim-btn {
      @media screen and (max-width: $tablet) {
        transform: scale(0.75);
      }
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
