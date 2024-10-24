<template>
  <StepHeader title="" :is-back-button-visible="false" @close="$emit('close')" />
  <div class="d-flex flex-column align-center pa-4 w-100">
    <MotivationBox>{{ $t('invitationLink.motivation') }}</MotivationBox>
    <CopyToClipboard :url="invitationLink" class="copy-url"></CopyToClipboard>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

import CopyToClipboard from '#components/copy-to-clipboard/CopyToClipboard.vue'
import MotivationBox from '#components/motivation-box/MotivationBox.vue'
import StepHeader from '#components/steps/StepHeader.vue'
import { createInvitationLinkMutation } from '#mutations/createInvitationLinkMutation'

defineEmits<{
  (e: 'close'): void
}>()

const invitationLink = ref('')

const { result: createInvitationLinkResult } = useQuery(
  createInvitationLinkMutation,
  {},
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(createInvitationLinkResult, (data: { createInvitationLink: string }) => {
  invitationLink.value = data.createInvitationLink
})
</script>

<style scoped>
.copy-url {
  width: clamp(230px, 62%, 380px);
}
</style>
