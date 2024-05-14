<template>
  <div class="user-info d-flex flex-row text-font">
    <div class="d-flex flex-column justify-center text-right pa-1 pl-3 w-100">
      <div class="phrase">{{ $t('menu.userPhrase') }}</div>
      <div class="name">{{ authStore.user?.profile.nickname }}</div>
    </div>
    <div class="avatar d-flex align-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 42 42"
        fill="none"
      >
        <path
          d="M41.5 21C41.5 32.3218 32.3218 41.5 21 41.5C9.67816 41.5 0.5 32.3218 0.5 21C0.5 9.67816 9.67816 0.5 21 0.5C32.3218 0.5 41.5 9.67816 41.5 21Z"
          v-bind-once="{ fill: `url(#pattern0_1817_548_${id})` }"
          stroke="#F5F5F5"
        />
        <defs>
          <pattern
            v-bind-once="{ id: `pattern0_1817_548_${id}` }"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use v-bind-once="{ 'xlink:href': `#image_${id}` }" transform="scale(0.00446429)" />
          </pattern>
          <image
            v-bind-once="{ id: `image_${id}` }"
            width="224"
            height="224"
            xlink:href="data:image/jpeg;base64,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"
          />
        </defs>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '#stores/authStore'

const props = defineProps<{
  userName: string
}>()

// Avoid problems when same svg is used several times by randomizing path and image ids
const id = Math.floor(Math.random() * 10e4)

const authStore = useAuthStore()
</script>

<style scoped lang="scss">
.user-info {
  border-radius: 40px;
  border: 1px solid #d6dfe9;
  background: #fff;
}
.avatar svg {
  height: 48px;
}
.name {
  font-size: 14px;
}
.phrase {
  font-size: 12px;
}
</style>
m
