import { gql } from 'graphql-tag'

export const updateMyTableMutation = gql`
  mutation ($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
    updateMyTable(name: $name, isPublic: $isPublic, userIds: $userIds) {
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
