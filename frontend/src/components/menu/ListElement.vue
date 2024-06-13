<template>
  <v-card class="mx-auto" width="400">
    <v-list lines="two">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"        
        :class="{ 'full-width': item.fullWidth, rounded: item.rounded, 'custom-list-item': true }"
        @click="handleItemClick"
        :title="item.title"
        :subtitle="item.subtitle"
      >
        <template v-if="item.prepend" #prepend>
          <component :is="item.prepend" v-bind="item.prependProps" />
        </template>

        <!-- <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle> -->

        <template v-if="item.append" #append>
          <component :is="item.append" v-bind="item.appendProps" />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

interface Item {
  title: string
  subtitle?: string
  fullWidth: boolean
  rounded?: boolean
  prepend?: string | object
  prependProps?: object
  append?: string | object
  appendProps?: object
}

defineProps({
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
})
const emit = defineEmits(['item-click'])

const handleItemClick = () => {
  closeMenu()
  emit('item-click')
}

const closeMenu = () => {
  // Logik zum Schließen des Menüs hinzufügen, falls erforderlich
}
</script>

<style scoped>
.custom-list-item {
  margin-bottom: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.full-width {
  width: 100%;
}

.rounded {
  border-radius: 16px;
}

.v-list-item-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.v-list-item-title {
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
}

.v-list-item-subtitle {
  font-size: 14px;
  color: gray;
}
</style>
