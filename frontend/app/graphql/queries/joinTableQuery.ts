import { gql } from 'graphql-tag'

export const joinTableQuery = gql`
  query ($tableId: Int!) {
    joinTable(tableId: $tableId)
  }
`
