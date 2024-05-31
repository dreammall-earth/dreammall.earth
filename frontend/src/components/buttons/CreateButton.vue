<template>
  <div class="create-button-container">
    <div>
      <v-container>
        <div class="button-wrapper">
          <svg
            width="1731"
            height="1719"
            viewBox="0 0 1731 1719"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.25" filter="url(#filter0_i_1513_6640)">
              <path
                d="M866 938.727C821.781 938.727 786 903.016 786 859.046C786 815.075 821.781 779.364 866 779.364C910.219 779.364 946 815.075 946 859.046C946 903.016 910.219 938.727 866 938.727Z"
                stroke="url(#paint0_linear_1513_6640)"
                stroke-width="22"
              />
            </g>
            <g filter="url(#filter1_i_1513_6640)">
              <circle
                cx="866.318"
                cy="859.045"
                r="61.5"
                transform="rotate(90 866.318 859.045)"
                stroke="url(#paint1_linear_1513_6640)"
                stroke-opacity="0.5"
                stroke-width="24"
              />
            </g>
            <g filter="url(#filter2_i_1513_6640)">
              <circle
                cx="866.136"
                cy="859.155"
                r="59.9955"
                transform="rotate(90 866.136 859.155)"
                fill="#EEEFF0"
                fill-opacity="0.0405"
              />
            </g>
            <circle
              cx="866.136"
              cy="859.155"
              r="49.9955"
              transform="rotate(90 866.136 859.155)"
              stroke="url(#paint2_linear_1513_6640)"
              stroke-width="20"
            />
            <g
              ref="warp"
              opacity="0.25"
              class="warp-ring"
              style="transform: scale(0)"
              :class="[!buttonIsTurned ? 'button-warp-on' : 'button-warp-off']"
              filter="url(#filter3_df_1513_6640)"
            >
              <ellipse
                cx="759"
                cy="768"
                rx="759"
                ry="768"
                transform="matrix(-4.37114e-08 1 1 4.37114e-08 98 100.364)"
                stroke="#2CA5B1"
                stroke-opacity="0.3"
                stroke-width="90"
                shape-rendering="crispEdges"
              />
            </g>
            <g
              class="button-wave"
              :class="[buttonIsTurned ? 'button-wave-on' : '']"
              opacity="0.25"
              filter="url(#filter0_f_1513_6933)"
            >
              <ellipse
                cx="759"
                cy="768"
                rx="95"
                ry="95"
                transform="matrix(-4.37114e-08 1 1 4.37114e-08 98 100.364)"
                stroke="#2CA5B1"
                stroke-width="4"
              />
            </g>
            <g id="create-button" clip-path="url(#clip0_1513_6640)" @click="onClick">
              <rect width="100%" height="100%" fill="transparent"></rect>
              <path
                d="M865.772 848.381H870C875.877 848.381 880.727 853.121 880.727 858.864C880.727 864.608 875.877 869.346 870 869.346H865.771H859.273H855.516H851.758H848V880.364H870C882.101 880.364 892 870.689 892 858.864C892 847.038 882.101 837.364 870 837.364H848V853.469V855.726H851.758H855.516H859.274H863.032H866.79H870C871.728 855.726 873.21 857.175 873.21 858.864C873.21 860.553 871.728 862.001 870 862.001H866.79H848V865.674H863.032H870C873.803 865.674 876.969 862.581 876.969 858.864C876.969 855.148 873.803 852.054 870 852.054H863.031H859.273H855.516H851.758V841.036H855.516H870C880.026 841.036 888.243 849.066 888.243 858.864C888.243 868.662 880.027 876.691 870 876.691H851.758V873.019H855.516H865.772H870C877.951 873.019 884.485 866.635 884.485 858.864C884.485 851.093 877.951 844.71 870 844.71H865.771H856.617V848.381H865.772Z"
                fill="url(#paint3_linear_1513_6640)"
              />
              <path
                opacity="0.75"
                d="M856.537 855.364H868.921H870V852.365H868.921L861.075 852.364H856.537H852V855.364H856.537Z"
                fill="url(#paint4_linear_1513_6640)"
              />
              <path
                opacity="0.75"
                d="M856.64 873.244H869.304H870.407V869.365H869.304L861.28 869.364H856.64H852V873.244H856.64Z"
                fill="url(#paint5_linear_1513_6640)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1513_6933"
                x="0"
                y="0"
                width="1731"
                height="1719"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_1513_6933" />
              </filter>
              <filter
                id="filter0_i_1513_6640"
                x="775"
                y="768.364"
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
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6640" />
              </filter>
              <filter
                id="filter1_i_1513_6640"
                x="792.818"
                y="785.545"
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
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6640" />
              </filter>
              <filter
                id="filter2_i_1513_6640"
                x="806.141"
                y="799.159"
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
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6640" />
              </filter>
              <filter
                id="filter3_df_1513_6640"
                x="-2"
                y="0.36377"
                width="1736"
                height="1718"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1513_6640"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1513_6640"
                  result="shape"
                />
                <feGaussianBlur stdDeviation="25" result="effect2_foregroundBlur_1513_6640" />
              </filter>
              <linearGradient
                id="paint0_linear_1513_6640"
                x1="973.763"
                y1="791.929"
                x2="767.395"
                y2="936.983"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1513_6640"
                x1="811.919"
                y1="772.006"
                x2="928.938"
                y2="939.073"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1513_6640"
                x1="821.732"
                y1="788.108"
                x2="917.251"
                y2="924.479"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0149795" stop-color="#2CA5B1" />
                <stop offset="1" stop-color="#999999" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1513_6640"
                x1="880.448"
                y1="884.434"
                x2="850.155"
                y2="830.742"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.1721" stop-color="#2CA5B1" />
                <stop offset="0.804" stop-color="#F09630" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1513_6640"
                x1="870"
                y1="853.864"
                x2="852"
                y2="853.864"
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
                id="paint5_linear_1513_6640"
                x1="870.407"
                y1="871.304"
                x2="852"
                y2="871.304"
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
              <clipPath id="clip0_1513_6640">
                <rect width="48" height="48" fill="white" transform="translate(844 834.364)" />
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
              @click="enterRoom"
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
import { useQuery } from '@vue/apollo-composable'
import { onMounted, ref } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'

const buttonIsTurned = ref(false)
const warp = ref<HTMLInputElement | null>(null)

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

  if (warp.value) {
    const style = window.getComputedStyle(warp.value)
    const matrix = style.transform
    const matrixArray = matrix.replace('matrix(', '').split(',')
    const scaleX = parseFloat(matrixArray[0])
    const scaleY = parseFloat(matrixArray[3])
    warp.value.style.transform = 'scale(' + scaleX + ',' + scaleY + ')'
    // TODO better solution maybe animationend
    setTimeout(function () {
      if (warp.value) {
        warp.value.style.transform = 'scale(' + 0 + ',' + 0 + ')'
      }
    }, 1000)
  }

  emit('click', 1)
}

const {
  result: joinMyRoomQueryResult,
  error: joinMyRoomQueryError,
  refetch,
} = useQuery(joinMyRoomQuery, null, {
  prefetch: false,
  fetchPolicy: 'no-cache',
})

const enterRoom = async () => {
  await refetch()
  if (joinMyRoomQueryError.value) {
    // eslint-disable-next-line no-console
    console.log(joinMyRoomQueryError.value.message)
  } else {
    window.open(joinMyRoomQueryResult.value?.joinMyRoom, '_blank')
  }
}
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.create-button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  max-width: 900px;
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

  .warp-ring {
    transition: transform 1s;
    transform: scale(0);
    transform-origin: center;
  }

  .button-warp-on {
    transform-origin: center;
    animation: 12s warp cubic-bezier(0.68, -0.45, 0.27, 1.45) infinite;
  }

  .button-warp-off {
    transform-origin: center;
    animation: 1s warp-off linear;
  }

  .button-wave-on {
    opacity: 0.5;
    scale: 1;
  }
}

.button-wrapper {
  position: relative;
}

.button-list {
  position: absolute;
  top: calc(50% + 10px);
  left: calc(50% - 165px);
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  transform: scale(0.5);

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
  transform: translateY(-100px) scale(0.8);
}

@keyframes warp {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(0.96);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes warp-off {
  100% {
    transform: scale(0);
  }
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
