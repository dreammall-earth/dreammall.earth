import { ApolloError } from '@apollo/client/errors'
import { useMutation } from '@vue/apollo-composable'
import { onMounted } from 'vue'

import { redeemInvitationLinkMutation } from '#mutations/redeemInvitationLinkMutation'

export const useRedeemInvitation = () => {
  const { mutate: redeem } = useMutation<{ redeemInvitationLink: boolean }>(
    redeemInvitationLinkMutation,
    {
      fetchPolicy: 'no-cache',
    },
  )

  onMounted(async () => {
    const invitationCode = localStorage.getItem('invitationCode')
    if (!invitationCode) return

    try {
      await redeem({ code: invitationCode })
    } catch (error: unknown) {
      if (!(error instanceof ApolloError && error.message === 'Link already used.')) throw error
    }

    localStorage.removeItem('invitationCode')
  })
}
