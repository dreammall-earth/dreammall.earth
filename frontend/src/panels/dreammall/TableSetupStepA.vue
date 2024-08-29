<template>
  <SimpleButton
    :label="$t('dream-mall-panel.setup.table-creation')"
    icon="mdi-video"
    class="mb-5"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'
import { TableSetupEmits } from '#src/panels/dreammall/TableSetupProps'

const emit = defineEmits<TableSetupEmits>()

const onClick = () => {
  emit('next')
}
</script>

<style scoped lang="scss"></style>
