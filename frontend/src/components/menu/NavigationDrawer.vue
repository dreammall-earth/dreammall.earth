<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="location"
    color="grey-lighten-4"
    temporary
    width="400"
    class="custom-drawer"
  >
    <slot />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref, watch, defineProps, defineEmits } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const display = useDisplay()
const drawer = ref(props.modelValue)
const location = computed(() => (display.mobile.value ? 'right' : undefined))

watch(() => props.modelValue, (newVal) => {
  drawer.value = newVal
})

watch(() => drawer.value, (newVal) => {
  if (newVal !== props.modelValue) {
    emits('update:modelValue', newVal)
  }
})
</script>

<style scoped>
.custom-drawer {
  background-color: #ffffff;
}
</style>
