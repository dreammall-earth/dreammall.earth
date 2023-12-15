import { gql } from 'graphql-tag'

export const subscribeToNewsletterMutation = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`
