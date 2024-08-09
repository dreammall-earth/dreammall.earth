import { gql } from 'graphql-tag'

import type { CurrentUser } from '#stores/userStore.js'

export type UpdateUserInput = {
  name: string
  introduction?: string | null
  availability?: null | 'available' | 'partly_available' | 'busy'
}

export const updateUserMutation = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      username
      introduction
      availability
      details {
        id
        category
        text
      }
      social {
        id
        type
        link
      }
      table {
        id
        name
        public
        users {
          id
          role
          name
          username
        }
      }
    }
  }
`
export type UpdateUserMutationResult = {
  updateUser: CurrentUser
}
