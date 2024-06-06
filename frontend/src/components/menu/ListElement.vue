<template>
  <v-list dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      class="custom-list-item"
      :class="{ 'full-width': item.fullWidth }"
    >
      <div class="list-item-content">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-action v-if="!item.fullWidth" class="list-item-action ">
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </v-list-item-action>
      </div>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

interface Item {
  title: string
  fullWidth: boolean
}

const props = defineProps({
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
})
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
}

.full-width {
  width: 100%;
}

.list-item-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.v-list-item-title {
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
}

.list-item-action {
  display: flex;
  align-items: center;
}

.custom-chip {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-chip .v-icon {
  font-size: 16px;
}
</style>
