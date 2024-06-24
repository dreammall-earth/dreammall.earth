<template>
  <v-navigation-drawer v-model="drawer" :location="computedLocation" temporary width="400">
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
<<<<<<< HEAD
  location: {
    type: String as PropType<NavigationDrawerLocation>,
    required: false,
    default: 'right',
    validator: (value: string) =>
      ['right', 'bottom', 'left', 'end', 'top', 'start'].includes(value as ValidLocation),
  },
})
=======
)
>>>>>>> 8bf62c91 (fix lint, fix test)

const emits = defineEmits(['update:modelValue'])
const display = useDisplay()
const drawer = ref(props.modelValue)

const computedLocation = computed(() => {
  return display.mobile.value ? 'bottom' : props.location
})

watch(
  () => props.modelValue,
  (newVal) => {
    drawer.value = newVal
  },
)

watch(
  () => drawer.value,
  (newVal) => {
    if (newVal !== props.modelValue) {
      emits('update:modelValue', newVal)
    }
  },
)
</script>
