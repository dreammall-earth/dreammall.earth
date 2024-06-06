<template>
  <NavigationDrawer :modelValue="drawer" @update:modelValue="updateDrawer">
    <ListElement :items="items" />
  </NavigationDrawer>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import NavigationDrawer from './NavigationDrawer.vue'
import ListElement from './ListElement.vue'

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:drawer'])

const items = ref([
  { title: 'LOLLY Krypto Entwicklung', fullWidth: false },
  { title: 'Aachener Freunde Treff', fullWidth: false },
  { title: 'Building A Wooden Guitar', fullWidth: false },
  { title: 'Co Working Space Manufaktur', fullWidth: true },
  { title: 'Intervallfasten Kalender', fullWidth: false },
  { title: 'Lomografie 2050', fullWidth: true },
  { title: 'Freies Treffen U50', fullWidth: false },
])

const updateDrawer = (value: boolean) => {
  emits('update:drawer', value)
}
</script>

<style scoped>
.list-container {
  margin-top: 20px;
}
</style>

