import { gql } from 'graphql-tag'

export const updateTableMutation = gql`
  mutation ($tableId: Int!, $name: String, $isPublic: Boolean, $userIds: [Int]) {
    updateTable(tableId: $tableId, name: $name, isPublic: $isPublic, userIds: $userIds) {
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
