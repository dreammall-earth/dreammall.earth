import { gql } from 'graphql-tag'

export const redeemInvitationLinkMutation = gql`
  query redeemInvitationLink($code: String!) {
    redeemInvitationLink(code: $code)
  }
`
