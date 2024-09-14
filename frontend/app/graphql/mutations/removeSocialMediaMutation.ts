import { gql } from 'graphql-tag'

export const removeSocialMediaMutation = gql`
  mutation removeSocialMedia($id: Int!) {
    removeSocialMedia(id: $id)
  }
`
