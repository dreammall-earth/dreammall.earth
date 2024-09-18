import { gql } from 'graphql-tag'

export const removeUserDetailMutation = gql`
  mutation removeUserDetail($id: Int!) {
    removeUserDetail(id: $id)
  }
`
