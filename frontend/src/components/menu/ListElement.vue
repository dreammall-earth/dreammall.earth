<template>
  <v-list dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      class="custom-list-item"
      :class="{ 'full-width': item.fullWidth, 'rounded': item.rounded }"
    >
      <v-list-item-avatar v-if="item.image" :src="item.image" />
      <v-list-item-icon v-if="item.icon">
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle>
      </v-list-item-content>
      <div class="right-content" v-if="item.rightContent">
        <component :is="item.rightContent" />
      </div>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

interface Item {
  title: string
  subtitle?: string
  fullWidth: boolean
  rounded?: boolean
  icon?: string
  image?: string
  rightContent?: string | object
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

.right-content {
  display: flex;
  align-items: center;
}
</style>
