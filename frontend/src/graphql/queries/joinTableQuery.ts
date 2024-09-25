import { gql } from 'graphql-tag'

export const joinTableQuery = gql`
  query ($tableId: String!) {
    joinTable(tableId: $tableId)
  }
`
