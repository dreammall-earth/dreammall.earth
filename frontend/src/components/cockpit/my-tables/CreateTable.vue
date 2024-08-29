<template>
  <div class="create-table">
    <div class="motivation">
      <img :src="Logo" class="logo" />
      {{ $t('cockpit.myTables.createTableA.motivation') }}
      <input v-model="table.name" placeholder="Name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '#assets/dreammall-logo-no-text.svg'

import type { CreateTableInput } from './CreateTableFlow.vue'

const table = defineModel<CreateTableInput>({
  required: true,
})
</script>

<style scoped>
.create-table {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.motivation {
  width: 380px;
  height: 103px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
  text-align: center;
  font-size: 14px;
  line-height: 110%; /* 15.4px */
  border-radius: 20x;
  background: var(--v-panel-element-background);
}

.logo {
  width: 40px;
}
</style>
