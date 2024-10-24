import { gql } from 'graphql-tag'

export type UpdateUserDetailInput = {
  id: number
  text: string
}

export const updateUserDetailMutation = gql`
  mutation updateUserDetail($data: UpdateUserDetailInput!) {
    updateUserDetail(data: $data) {
      id
      text
    }
  }
`

export type UpdateUserDetailMutationResult = {
  updateUserDetail: UpdateUserDetailInput
}
