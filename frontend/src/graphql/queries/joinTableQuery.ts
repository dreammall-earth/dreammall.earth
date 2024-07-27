import { gql } from 'graphql-tag'

export const joinTableQuery = gql`
  query ($tableId: Int!, $userName: String!) {
    joinTable(tableId: $tableId, userName: $userName)
  }
`
