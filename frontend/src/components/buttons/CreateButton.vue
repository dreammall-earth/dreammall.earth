<template>
  <div class="create-button-container">
    <div>
      <v-container>
        <div class="button-wrapper">
          <svg
            width="206"
            height="205"
            viewBox="0 0 206 205"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="create-button" clip-path="url(#clip0_1513_6616)" @click="onClick">
              <rect width="100%" height="100%" fill="transparent"></rect>
              <path
                d="M102.772 92.0176H107C112.877 92.0176 117.727 96.7568 117.727 102.5C117.727 108.244 112.877 112.982 107 112.982H102.771H96.2733H92.5162H88.7581H85V124H107C119.101 124 129 114.325 129 102.5C129 90.6747 119.101 81 107 81H85V97.1057V99.3626H88.7581H92.5162H96.2743H100.032H103.79H107C108.728 99.3626 110.21 100.811 110.21 102.5C110.21 104.189 108.728 105.637 107 105.637H103.79H85V109.31H100.032H107C110.803 109.31 113.969 106.217 113.969 102.5C113.969 98.7839 110.803 95.6901 107 95.6901H100.031H96.2733H92.5162H88.7581V84.6725H92.5162H107C117.026 84.6725 125.243 92.7027 125.243 102.5C125.243 112.298 117.027 120.327 107 120.327H88.7581V116.655H92.5162H102.772H107C114.951 116.655 121.485 110.271 121.485 102.5C121.485 94.7297 114.951 88.346 107 88.346H102.771H93.617V92.0176H102.772Z"
                fill="url(#paint0_linear_1513_6616)"
              />
              <path
                opacity="0.75"
                d="M89.537 99H101.921H103V96.0007H101.921L94.0749 96H89.537H85V99H89.537Z"
                fill="url(#paint1_linear_1513_6616)"
              />
              <path
                opacity="0.75"
                d="M89.6397 116.88H102.304H103.407V113.001H102.304L94.2803 113H89.6397H85V116.88H89.6397Z"
                fill="url(#paint2_linear_1513_6616)"
              />
            </g>
            <g opacity="0.25" filter="url(#filter0_i_1513_6616)">
              <path
                d="M103 182.364C58.7808 182.364 23 146.653 23 102.682C23 58.7111 58.7808 23 103 23C147.219 23 183 58.7111 183 102.682C183 146.653 147.219 182.364 103 182.364Z"
                stroke="url(#paint3_linear_1513_6616)"
                stroke-width="22"
              />
            </g>
            <g filter="url(#filter1_i_1513_6616)">
              <circle
                cx="103.318"
                cy="102.682"
                r="61.5"
                transform="rotate(90 103.318 102.682)"
                stroke="url(#paint4_linear_1513_6616)"
                stroke-opacity="0.5"
                stroke-width="24"
              />
            </g>
            <g filter="url(#filter2_i_1513_6616)">
              <circle
                cx="103.136"
                cy="102.791"
                r="49.9955"
                transform="rotate(90 103.136 102.791)"
                stroke="url(#paint5_linear_1513_6616)"
                stroke-width="20"
              />
            </g>
            <g opacity="0.25" filter="url(#filter3_f_1513_6616)">
              <ellipse
                cx="103"
                cy="102.5"
                rx="90.5"
                ry="91"
                transform="rotate(90 103 102.5)"
                stroke="#2CA5B1"
                stroke-width="4"
              />
            </g>
            <g
              class="button-wave"
              :class="[buttonIsTurned ? 'button-wave-on' : '']"
              opacity="0.25"
              filter="url(#filter0_f_1513_6933)"
            >
              <ellipse
                cx="94"
                cy="95"
                rx="94"
                ry="95"
                transform="matrix(-4.37114e-08 1 1 4.37114e-08 12 12)"
                stroke="#2CA5B1"
                stroke-width="4"
              />
            </g>
            <defs>
              <filter
                id="filter0_i_1513_6616"
                x="12"
                y="12"
                width="182"
                height="183.364"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6616" />
              </filter>
              <filter
                id="filter0_f_1513_6933"
                x="0"
                y="0"
                width="214"
                height="212"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_1513_6933" />
              </filter>
              <filter
                id="filter1_i_1513_6616"
                x="29.8184"
                y="29.1816"
                width="147"
                height="149"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6616" />
              </filter>
              <filter
                id="filter2_i_1513_6616"
                x="43.1406"
                y="42.7959"
                width="119.991"
                height="121.991"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6616" />
              </filter>
              <filter
                id="filter3_f_1513_6616"
                x="0"
                y="0"
                width="206"
                height="205"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_1513_6616" />
              </filter>
              <linearGradient
                id="paint0_linear_1513_6616"
                x1="117.448"
                y1="128.071"
                x2="87.1548"
                y2="74.3785"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.1721" stop-color="#2CA5B1" />
                <stop offset="0.804" stop-color="#F09630" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1513_6616"
                x1="103"
                y1="97.5001"
                x2="84.9996"
                y2="97.5001"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.0405" stop-color="#EEEFF0" stop-opacity="0.0405" />
                <stop offset="0.1632" stop-color="#BFC3C7" stop-opacity="0.1632" />
                <stop offset="0.29" stop-color="#979DA3" stop-opacity="0.29" />
                <stop offset="0.4195" stop-color="#777E86" stop-opacity="0.4195" />
                <stop offset="0.5522" stop-color="#5D6670" stop-opacity="0.5522" />
                <stop offset="0.6896" stop-color="#4B5460" stop-opacity="0.6896" />
                <stop offset="0.8346" stop-color="#404A56" stop-opacity="0.8346" />
                <stop offset="1" stop-color="#3D4753" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1513_6616"
                x1="103.407"
                y1="114.94"
                x2="84.9995"
                y2="114.94"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.0405" stop-color="#EEEFF0" stop-opacity="0.0405" />
                <stop offset="0.1632" stop-color="#BFC3C7" stop-opacity="0.1632" />
                <stop offset="0.29" stop-color="#979DA3" stop-opacity="0.29" />
                <stop offset="0.4195" stop-color="#777E86" stop-opacity="0.4195" />
                <stop offset="0.5522" stop-color="#5D6670" stop-opacity="0.5522" />
                <stop offset="0.6896" stop-color="#4B5460" stop-opacity="0.6896" />
                <stop offset="0.8346" stop-color="#404A56" stop-opacity="0.8346" />
                <stop offset="1" stop-color="#3D4753" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1513_6616"
                x1="210.763"
                y1="35.5654"
                x2="4.3952"
                y2="180.62"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1513_6616"
                x1="48.9187"
                y1="15.6422"
                x2="165.938"
                y2="182.71"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_1513_6616"
                x1="58.7317"
                y1="31.7441"
                x2="154.251"
                y2="168.116"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <clipPath id="clip0_1513_6616">
                <rect width="48" height="48" fill="white" transform="translate(81 78)" />
              </clipPath>
            </defs>
          </svg>

          <transition-group name="fade" tag="div" class="button-list">
            <MainButton
              v-if="buttonIsTurned"
              key="1"
              class="new-project-button"
              variant="fourth"
              label="New Project"
              size="auto"
              icon="plus"
              >{{ $t('buttons.newProject') }}
            </MainButton>
            <MainButton
              v-if="buttonIsTurned"
              key="2"
              class="new-table-button"
              variant="primary"
              label="New Table"
              size="auto"
              icon="plus"
              >{{ $t('buttons.newTable') }}
            </MainButton>
            <MainButton
              v-if="buttonIsTurned"
              key="3"
              class="assistant-button"
              variant="gradient"
              label="Assistant"
              size="auto"
              icon="ear-hearing"
              >{{ $t('buttons.toAssistant') }}
            </MainButton>
          </transition-group>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'

const buttonIsTurned = ref(false)

// import CreateButtonSvg from '#components/buttons/CreateButtonSvg.vue'

// const props = withDefaults(
//   defineProps<{}>(),
//   {},
// )

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

onMounted(() => {})

const onClick = (event: MouseEvent) => {
  const node = event.target as HTMLElement
  const parent = node.parentNode as SVGElement

  parent.classList.toggle('create-button--turned')
  buttonIsTurned.value = !buttonIsTurned.value
  emit('click', 1)
}
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.create-button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  max-width: 400px;
  transform: translate(-50%, -50%);
}

svg {
  width: 100%;
  height: 100%;

  #create-button {
    pointer-events: all;
    cursor: pointer;
    transition: transform 0.4s ease-in-out;
    transform-box: fill-box;
    transform-origin: center;
  }

  .create-button--turned {
    transform: rotate(-90deg);
  }

  .button-wave {
    opacity: 0;
    transition:
      opacity 1s,
      scale 0.7s;
    transform-origin: center;
    scale: 0;
  }

  .button-wave-on {
    opacity: 0.75;
    scale: 1;
  }
}

.button-wrapper {
  position: relative;
}

.button-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  width: 100%;
  margin-top: -5px;

  .assistant-button {
    margin: 0 40px;
    transition-delay: 0.2s;
  }

  .new-project-button {
    margin: 0 20px;
    transition-delay: 0s;
  }

  .new-table-button {
    margin: 0 20px;
    transition-delay: 0.1s;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-200px) scale(0.8);
}
</style>

<style lang="scss">
.button-list {
  .assistant-button {
    i {
      margin-right: 16px;
    }
  }

  .project-button {
    i {
      margin-right: 16px;
    }
  }

  .table-button {
    i {
      margin-right: 16px;
    }
  }
}
</style>
