<template>
  <div class="w-100 px-3 py-2">
    <InfoBox class="mx-2 mb-4" :text="$t('dream-mall-panel.incoming-invitation.swap-text')" />
    <IncomingInvitationItem
      :invitation="invitation"
      :dismiss-caption="$t('dream-mall-panel.incoming-invitation.dismiss-swap')"
      :accept-caption="$t('dream-mall-panel.incoming-invitation.accept-swap')"
      @accept="() => emit('submit')"
      @dismiss="() => emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import InfoBox from '#components/info-box/InfoBox.vue'
import Invitation from '#components/malltalk/interfaces/Invitation'
import IncomingInvitationItem from '#components/malltalk/invitation/IncomingInvitationItem.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const invitation = defineModel<Invitation>({ required: true })
</script>
