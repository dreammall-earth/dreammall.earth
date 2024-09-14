import { gql } from 'graphql-tag'

export const confirmNewsletter = gql`
  mutation confirmNewsletter($code: String!) {
    confirmNewsletter(code: $code)
  }
`
