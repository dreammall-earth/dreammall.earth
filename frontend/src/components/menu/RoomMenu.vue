<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="location"
    color="grey-lighten-4"
    temporary
    width="400"
    class="custom-drawer"
  >
  <v-list dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      class="custom-list-item"
      :class="{ 'full-width': item.fullWidth }"
    >
      <div class="list-item-content">
        <v-list-item-title v-text="item.title"></v-list-item-title>
        <v-list-item-action v-if="!item.fullWidth" class="list-item-action ">
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </v-list-item-action>
      </div>
    </v-list-item>
  </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const drawer = ref(true)
const items = ref([
{ title: 'LOLLY Krypto Entwicklung', fullWidth: false },
  { title: 'Aachener Freunde Treff', fullWidth: false },
  { title: 'Building A Wooden Guitar', fullWidth: false },
  { title: 'Co Working Space Manufaktur', fullWidth: true },
  { title: 'Intervallfasten Kalender', fullWidth: false },
  { title: 'Lomografie 2050', fullWidth: true },
  { title: 'Freies Treffen U50', fullWidth: false },
])

const display = useDisplay()
const location = computed(() => (display.mobile.value ? 'right' : undefined))

watch(() => drawer.value, (newVal) => {
  if (newVal) {
    drawer.value = true
  }
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
