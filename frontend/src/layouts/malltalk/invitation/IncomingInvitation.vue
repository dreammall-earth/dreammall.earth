<template>
  <div class="w-100 px-3 py-2">
    <IncomingInvitationItem
      :invitation="invitation"
      :dismiss-caption="$t('dream-mall-panel.incoming-invitation.dismiss-table')"
      :accept-caption="$t('dream-mall-panel.incoming-invitation.accept-table')"
      @accept="() => emit('submit')"
      @dismiss="() => emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import Invitation from '#layouts/malltalk/interfaces/Invitation'

import IncomingInvitationItem from './IncomingInvitationItem.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const invitation = defineModel<Invitation>({ required: true })
</script>
