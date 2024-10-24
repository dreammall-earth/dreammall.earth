import { gql } from 'graphql-tag'

export const redeemInvitationLinkMutation = gql`
  mutation redeemInvitationLink($code: String!) {
    redeemInvitationLink(code: $code)
  }
`
