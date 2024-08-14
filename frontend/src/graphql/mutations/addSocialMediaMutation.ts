import { gql } from 'graphql-tag'

export type AddSocialMediaInput = {
  type: string
  link: string
}

export const addSocialMediaMutation = gql`
  mutation addSocialMedia($data: AddSocialMediaInput!) {
    addSocialMedia(data: $data) {
      id
      text
      category
    }
  }
`

export type AddSocialMediaMutationResult = {
  addSocialMedia: AddSocialMediaInput & {
    id: number
  }
}
