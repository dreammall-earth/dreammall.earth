import { gql } from 'graphql-tag'

export const subscribeToNewsletter = gql`
  mutation subscribeToNewsletter($data: SubscribeToNewsletterInput!) {
    subscribeToNewsletter(subscribeToNewsletterData: $data)
  }
`
