import { gql } from 'graphql-tag'

export const createMyTableMutation = gql`
  mutation ($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
    createMyTable(name: $name, isPublic: $isPublic, userIds: $userIds) {
      id
      meetingID
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
