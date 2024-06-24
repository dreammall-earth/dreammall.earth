<template>
  <v-navigation-drawer v-model="isOpen" :location="computedLocation" temporary width="400">
    <slot />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

export type DrawerLocation = 'right' | 'bottom' | 'left' | 'end' | 'top' | 'start'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    location?: DrawerLocation
  }>(),
  {
    location: 'right',
  },
)

const emits = defineEmits(['update:modelValue'])
const display = useDisplay()
const isOpen = ref(props.modelValue)

const computedLocation = computed(() => {
  return display.mobile.value ? 'bottom' : props.location
})

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
  },
)

watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal !== props.modelValue) {
      emits('update:modelValue', newVal)
    }
  },
)
</script>
