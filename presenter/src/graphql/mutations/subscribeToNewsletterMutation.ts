import { gql } from 'graphql-tag'

export const subscribeToNewsletterMutation = gql`
  mutation subscribeToNewsletter($data: SubscribeToNewsletterInput!) {
    subscribeToNewsletter(subscribeToNewsletterData: $data)
  }
`
