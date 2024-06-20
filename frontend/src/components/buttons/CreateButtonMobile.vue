<template>
  <div class="button-wrapper" :class="[showButtonList ? 'button-wrapper--active' : '']">
    <Teleport v-if="teleportComponent" to="#teleported">
      <div class="button-list-mobile" :class="[showButtonList ? 'button-list-mobile--active' : '']">
        <v-img class="w-100 menu-divider" :src="Divider" />
        <v-img
          class="w-100 menu-triangle"
          :class="[showButtonList ? 'menu-triangle--turned' : '']"
          :src="Triangle"
        />
        <MainButton
          class="assistant-button"
          variant="border-gradient"
          label="Assistant"
          size="auto"
          icon="ear-hearing"
          >{{ $t('buttons.toAssistant') }}
        </MainButton>
        <MainButton
          class="new-table-button"
          variant="border-yellow"
          label="New Table"
          size="auto"
          icon="plus"
          @click="enterRoom"
          >{{ $t('buttons.newTable') }}
        </MainButton>
        <MainButton
          class="new-project-button"
          variant="border-blue"
          label="New Project"
          size="auto"
          icon="plus"
          >{{ $t('buttons.newProject') }}
        </MainButton>
      </div>
    </Teleport>
    <svg
      width="182"
      height="182"
      viewBox="0 0 182 182"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        class="most-outer-rings"
        :class="[showButtonList ? 'most-outer-rings--active' : '']"
        opacity="0.25"
        filter="url(#filter0_i_1513_6638)"
      >
        <path
          d="M91 170.364C46.7808 170.364 11 134.653 11 90.6818C11 46.7111 46.7808 11 91 11C135.219 11 171 46.7111 171 90.6818C171 134.653 135.219 170.364 91 170.364Z"
          stroke="url(#paint0_linear_1513_6638)"
          stroke-width="22"
        />
      </g>
      <g
        class="outer-rings"
        :class="[showButtonList ? 'outer-rings--active' : '']"
        filter="url(#filter1_i_1513_6638)"
      >
        <circle
          cx="91.3183"
          cy="90.6817"
          r="61.5"
          transform="rotate(90 91.3183 90.6817)"
          stroke="url(#paint1_linear_1513_6638)"
          stroke-opacity="0.5"
          stroke-width="24"
        />
      </g>
      <g filter="url(#filter2_i_1513_6638)">
        <circle
          cx="91.1363"
          cy="90.7914"
          r="59.9955"
          transform="rotate(90 91.1363 90.7914)"
          fill="#EEEFF0"
          fill-opacity="0.0405"
        />
      </g>
      <circle
        cx="91.1363"
        cy="90.7914"
        r="49.9955"
        transform="rotate(90 91.1363 90.7914)"
        stroke="url(#paint2_linear_1513_6638)"
        stroke-width="20"
        fill="white"
      />
      <g id="create-button-mobile" clip-path="url(#clip0_1513_6638)" @click="onClick">
        <rect width="100%" height="100%" fill="transparent"></rect>
        <path
          d="M90.7724 80.0176H95C100.877 80.0176 105.727 84.7568 105.727 90.5C105.727 96.2441 100.877 100.982 95 100.982H90.7714H84.2733H80.5162H76.7581H73V112H95C107.101 112 117 102.325 117 90.5C117 78.6747 107.101 69 95 69H73V85.1057V87.3626H76.7581H80.5162H84.2743H88.0324H91.7905H95C96.7284 87.3626 98.2105 88.8109 98.2105 90.5C98.2105 92.1891 96.7284 93.6374 95 93.6374H91.7895H73V97.3099H88.0324H95C98.8027 97.3099 101.969 94.217 101.969 90.5C101.969 86.7839 98.8027 83.6901 95 83.6901H88.0314H84.2733H80.5162H76.7581V72.6725H80.5162H95C105.026 72.6725 113.243 80.7027 113.243 90.5C113.243 100.298 105.027 108.327 95 108.327H76.7581V104.655H80.5162H90.7724H95C102.951 104.655 109.485 98.2712 109.485 90.5C109.485 82.7297 102.951 76.346 95 76.346H90.7714H81.617V80.0176H90.7724Z"
          fill="url(#paint3_linear_1513_6638)"
        />
        <path
          opacity="0.75"
          d="M81.537 87H93.9213H95V84.0007H93.9213L86.0749 84H81.537H77V87H81.537Z"
          fill="url(#paint4_linear_1513_6638)"
        />
        <path
          opacity="0.75"
          d="M81.6397 104.88H94.304H95.407V101.001H94.304L86.2803 101H81.6397H77V104.88H81.6397Z"
          fill="url(#paint5_linear_1513_6638)"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_1513_6638"
          x="0"
          y="0"
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
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6638" />
        </filter>
        <filter
          id="filter1_i_1513_6638"
          x="17.8184"
          y="17.1816"
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
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6638" />
        </filter>
        <filter
          id="filter2_i_1513_6638"
          x="31.1406"
          y="30.7959"
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
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1513_6638" />
        </filter>
        <linearGradient
          id="paint0_linear_1513_6638"
          x1="198.763"
          y1="23.5654"
          x2="-7.6048"
          y2="168.62"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0149795" stop-color="#2CA5B1" />
          <stop offset="1" stop-color="#999999" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1513_6638"
          x1="36.9187"
          y1="3.64216"
          x2="153.938"
          y2="170.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0149795" stop-color="#2CA5B1" />
          <stop offset="1" stop-color="#999999" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1513_6638"
          x1="46.7317"
          y1="19.7441"
          x2="142.251"
          y2="156.116"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0149795" stop-color="#2CA5B1" />
          <stop offset="1" stop-color="#999999" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1513_6638"
          x1="105.448"
          y1="116.071"
          x2="75.1548"
          y2="62.3785"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1721" stop-color="#2CA5B1" />
          <stop offset="0.804" stop-color="#F09630" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1513_6638"
          x1="94.9997"
          y1="85.5001"
          x2="76.9996"
          y2="85.5001"
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
          id="paint5_linear_1513_6638"
          x1="95.4068"
          y1="102.94"
          x2="76.9995"
          y2="102.94"
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
        <clipPath id="clip0_1513_6638">
          <rect width="48" height="48" fill="white" transform="translate(69 66)" />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { onMounted, ref } from 'vue'

import Divider from '#assets/img/divider.svg'
import Triangle from '#assets/img/triangle.svg'
import MainButton from '#components/buttons/MainButton.vue'

const showButtonList = ref(false)
const teleportComponent = ref(false)

// import CreateButtonSvg from '#components/buttons/CreateButtonSvg.vue'

// const props = withDefaults(
//   defineProps<{}>(),
//   {},
// )

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

onMounted(() => {
  // make sure that dom is ready to teleport nodes, otherwise it wont render or it wont animate
  teleportComponent.value = true
})

const onClick = () => {
  try {
    showButtonList.value = !showButtonList.value
    emit('click', 1)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while CreateButtonMobile click', error)
  }
}

const enterRoom = () => {
  navigate('/room/')
}
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.button-wrapper {
  position: absolute;
  top: calc(50% - 60px);
  left: calc(50% - 40px);
  transition: top 0.75s;

  @media screen and (min-width: $tablet) {
    display: none;
  }

  &--active {
    top: calc(50% - 70px);
  }
}

.button-list-mobile {
  position: absolute;
  top: calc(50% - 0px);
  left: calc(50% - 90px);
  z-index: -1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: start;
  width: 180px;
  height: 220px;
  padding-top: 30px;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
  transition: top 0.75s;

  @media screen and (min-width: $tablet) {
    display: none;
  }

  &--active {
    top: calc(50% - 280px);
  }

  .menu-triangle {
    position: absolute;
    top: -95px;
    max-width: 10px;
    transition:
      0.75s transform,
      0.75s 0.25s top;
    transform-origin: center;

    &--turned {
      top: 10px;
      transition:
        0.75s rotate,
        0.5s top;
      transform: rotate(180deg);
    }
  }

  .menu-divider {
    position: absolute;
    top: 0;
    max-width: 60px;
  }

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

svg {
  width: 100%;
  max-width: 80px;
  height: 100%;

  #create-button-mobile {
    pointer-events: all;
    cursor: pointer;
    transition: transform 0.4s ease-in-out;
    transform-box: fill-box;
    transform-origin: center;
  }

  .outer-rings {
    clip-path: inset(0 0 65% 0);
    transition: clip-path 0.75s;

    &--active {
      clip-path: inset(0 0 0 0);
    }
  }

  .most-outer-rings {
    clip-path: inset(0 0 62% 0);
    transition: clip-path 0.75s;

    &--active {
      clip-path: inset(0 0 0 0);
    }
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
</style>

<style lang="scss">
.button-list-mobile {
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
