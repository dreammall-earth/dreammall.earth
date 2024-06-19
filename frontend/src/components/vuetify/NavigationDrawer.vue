<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="computedLocation"
    color="grey-lighten-4"
    temporary
    width="400"
    class="custom-drawer"
    mobile
    mobile-breakpoint="md"
  >
    <slot />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

type validLocations = 'right' | 'bottom' | 'left' | 'end' | 'top' | 'start'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  location: {
    type: validLocations,
    required: false,
    default: 'right',
  },
})
const emits = defineEmits(['update:modelValue'])
const display = useDisplay()
const drawer = ref(props.modelValue)
// Behalten Sie die übergebene Location bei und überschreiben Sie nur, wenn der Bildschirm klein ist
const computedLocation = computed(() => (display.mobile.value ? 'bottom' : props.location))
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

<style scoped>
.custom-drawer {
  background-color: #fff;
}
</style>
