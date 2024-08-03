<template>
  <div class="custom-select">
    <select v-model="selected" class="availability">
      <option v-for="item in options" :key="item.value || 0" :value="item.value">
        {{ item.circle }} {{ item.text }} <v-icon icon="$chevronDown"></v-icon>
      </option>
    </select>
    <div class="selected">
      {{ selectedOption?.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const selected = defineModel<string | null>()

const options = [
  { value: null, text: 'Please choose', circle: '/' },
  { value: 'available', text: 'Available', circle: '◉' },
  { value: 'partly_available', text: 'Partly available', circle: '◔' },
  { value: 'busy', text: 'Busy', circle: '◎' },
]

const selectedOption = computed(() => options.find((o) => o.value === selected.value))
</script>

<style scoped>
.custom-select {
  position: relative;
}

.custom-select select {
  display: none;
}

.custom-select::after {
  grid-column: 2;
  grid-row: 1;

  content: '';

  font-size: 10px;
  color: white;
  display: flex;
  height: 24px;
  padding: 0px 12px 0px 4px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(214, 223, 233, 0.4);
  background: #5d6670;
}
</style>
