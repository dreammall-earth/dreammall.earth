<template>
  <div v-show="!!props.data" ref="hoverRef" class="hover-info" :style="style">
    <div class="info-box pa-2">
      <v-avatar :size="25" class="avatar mb-2 text-font">
        <span>{{ props.data && getInitials(props.data.name) }}</span>
      </v-avatar>
      <h3>{{ props.data?.name }}</h3>
    </div>
    <div v-show="showMoreButton" class="mt-2 d-flex align-center justify-center">
      <button @click="showMore">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <g opacity="0.75">
            <circle cx="14" cy="14" r="14" fill="#3D4753" />
            <circle cx="14" cy="14" r="13.5" stroke="#979797" stroke-opacity="0.3" />
          </g>
          <circle cx="7" cy="14" r="2" transform="rotate(-90 7 14)" fill="#CCCCCC" />
          <circle cx="14" cy="14" r="2" transform="rotate(-90 14 14)" fill="#CCCCCC" />
          <circle cx="21" cy="14" r="2" transform="rotate(-90 21 14)" fill="#CCCCCC" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getInitials } from '#src/utils/getInitials'

import type { UserWithProfile } from '#stores/userStore'

const props = defineProps<{
  data: UserWithProfile | null
  x: number
  y: number
  showMoreButton: boolean
}>()

const emit = defineEmits<{
  (e: 'show-more'): void
}>()

const showMore = () => emit('show-more')

const coordinates = computed(() => ({
  x: props.x,
  y: props.y,
}))

const style = computed(() => ({
  left: `${coordinates.value.x - 50}px`,
  top: `${coordinates.value.y - 50}px`,
}))
</script>

<style scoped>
.hover-info {
  position: fixed;
  z-index: 100;
}

.info-box {
  width: 100px;
  height: 100px;
  font-size: 10px;
  color: #f5f5f5;
  text-align: center;
  background: rgb(61 71 83 / 75%);
  backdrop-filter: blur(15px);
  border: 1px solid rgb(151 151 151 / 30%);
  border-radius: 10px;
}

.avatar {
  background-color: rgb(var(--v-theme-cockpit-highlight));
  border-radius: 15px;
}
</style>
