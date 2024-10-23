<template>
  <MotivationBox>{{ $t('invitationLink.motivation') }}</MotivationBox>
  <CopyToClipboard :url="invitationLink"></CopyToClipboard>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

import MotivationBox from '#components/cockpit/my-tables/create-table/MotivationBox.vue'
import CopyToClipboard from '#components/copy-to-clipboard/CopyToClipboard.vue'
import { createInvitationLinkMutation } from '#mutations/createInvitationLinkMutation'

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
