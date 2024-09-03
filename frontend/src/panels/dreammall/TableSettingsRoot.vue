<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn-group variant="outlined" class="rounded-lg" divided>
          <v-btn class="px-6" @click="copyToClipboard">
            <v-icon icon="mdi-link" class="mr-2" />
            {{ $t('dream-mall-panel.call.link') }}
          </v-btn>
          <v-btn class="px-6" @click="onClick('settings')">
            <v-icon icon="mdi-pencil" class="mr-2" />
            {{ $t('dream-mall-panel.call.edit') }}
          </v-btn>
          <v-btn class="px-6" @click="onClick('users')">
            <v-icon icon="mdi-account-plus" class="mr-2" />
            {{ $t('dream-mall-panel.call.add-user') }}
          </v-btn>
        </v-btn-group>
      </v-col>
    </v-row>
    <SimpleButton
      color="#F44336"
      :label="$t('dream-mall-panel.call.leave-table')"
      class="mt-12 mb-5"
      disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { TableSetupEmits, TableSetupProps } from '#src/panels/dreammall/TableSetupProps'

defineProps<TableSetupProps>()
const emit = defineEmits<TableSetupEmits>()

const onClick = (stepId: string) => {
  emit('custom', stepId)
}

const copyToClipboard = async () => {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch (err) {
    GlobalErrorHandler.error('Failed to url: ', err)
  }
}
</script>
