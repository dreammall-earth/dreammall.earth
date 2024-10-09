<template>
  <IncomingInvitationItem
    class="mx-3 my-2"
    :invitation="invitation"
    :dismiss-caption="$t('dream-mall-panel.incoming-invitation.dismiss-table')"
    :accept-caption="$t('dream-mall-panel.incoming-invitation.accept-table')"
    @accept="() => emit('submit')"
    @dismiss="() => emit('next')"
  />
</template>

<script setup lang="ts">
import Invitation from '#components/malltalk/interfaces/Invitation'
import IncomingInvitationItem from '#components/malltalk/invitation/IncomingInvitationItem.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const invitation = defineModel<Invitation>({ required: true })
</script>

<style lang="scss" scoped></style>
