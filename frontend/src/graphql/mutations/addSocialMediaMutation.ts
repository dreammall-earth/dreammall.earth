import { gql } from 'graphql-tag'

export type SocialMediaType =
  | 'discord'
  | 'telegram'
  | 'snapchat'
  | 'reddit'
  | 'wechat'
  | 'whatsapp'
  | 'xing'
  | 'pintarest'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'x'

export type AddSocialMediaInput = {
  type: SocialMediaType
  link: string
}

export const addSocialMediaMutation = gql`
  mutation addSocialMedia($data: AddSocialMediaInput!) {
    addSocialMedia(data: $data) {
      id
      type
      link
    }
  }
`

export type AddSocialMediaMutationResult = {
  addSocialMedia: AddSocialMediaInput & {
    id: number
  }
}
