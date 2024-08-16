import { gql } from 'graphql-tag'

export const updateMyTableMutation = gql`
  mutation ($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
    updateMyRoom(name: $name, isPublic: $isPublic, userIds: $userIds) {
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
`
