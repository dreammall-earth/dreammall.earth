import { gql } from 'graphql-tag'

export const createMyTableMutation = gql`
  mutation ($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
    createMyRoom(name: $name, isPublic: $isPublic, userIds: $userIds) {
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
