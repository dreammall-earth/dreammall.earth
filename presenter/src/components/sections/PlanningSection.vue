<template>
  <div class="planning-section v-container">
    <v-row class="section-header">
      <v-col>
        <h2 class="section-headline">
          {{ $t('home.planningSection.headline') }}
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
            :label="$t('home.planningSection.timelineBtn')"
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
import MainButton from '#components/buttons/MainButton.vue'

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

.planning-section {
  max-width: $section-max-width;
  background: $background-color-primary;

  .section-header {
    text-align: center;

    h2.section-headline {
      @include section-content-headline;

      background: linear-gradient(
        255deg,
        $font-color-headline-transition-start 23.75%,
        $font-color-headline-transition-end 66.34%
      );
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
