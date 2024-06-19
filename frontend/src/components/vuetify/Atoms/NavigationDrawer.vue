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
import { computed, ref, watch, PropType } from 'vue'
import { useDisplay } from 'vuetify'

type ValidLocation = 'right' | 'bottom' | 'left' | 'end' | 'top' | 'start'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String as PropType<ValidLocation>,
    required: false,
    default: 'right',
    validator: (value: string) =>
      ['right', 'bottom', 'left', 'end', 'top', 'start'].includes(value as ValidLocation),
  },
})

const emits = defineEmits(['update:modelValue'])
const display = useDisplay()
const drawer = ref(props.modelValue)

const computedLocation = computed(() => {
  return display.mobile.value
    ? 'bottom'
    : ['right', 'bottom', 'left', 'end', 'top', 'start'].includes(props.location)
      ? props.location
      : 'right'
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

<style scoped>
.custom-drawer {
  background-color: #fff;
}
</style>
