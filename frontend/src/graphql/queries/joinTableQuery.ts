import { gql } from 'graphql-tag'

export const joinTableQuery = gql`
  query ($tableId: Int!, $userName: String!, $userId: Int) {
    joinTable(tableId: $tableId, userName: $userName, userId: $userId)
  }
`
