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
          ref="video"
          class="video w-100"
          autoplay
          muted
          preload="auto"
          playsinline
          @ended="triggerButtonVisibility"
        >
          <source :src="Video" type="video/mp4" />
        </video>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="anim-btn-col text-center">
        <Transition>
          <MainButton
            v-if="showButton"
            class="mt-8"
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
import { ref } from 'vue'

import Video from '#assets/video/timeline.mp4'
import MainButton from '#components/inputs/MainButton.vue'

const showButton = ref(false)
const video = ref<HTMLFormElement>()

function triggerButtonVisibility() {
  showButton.value = true
}

function playVideo() {
  if (video.value && video.value.ended) {
    video.value.play()
  }
}
</script>

<style scoped lang="scss">
.section4 {
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
