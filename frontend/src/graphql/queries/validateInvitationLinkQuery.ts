import { gql } from 'graphql-tag'

export const validateInvitationLinkQuery = gql`
  query validateInvitationLink($code: String!) {
    validateInvitationLink(code: $code) {
      name
    }
  }
`
