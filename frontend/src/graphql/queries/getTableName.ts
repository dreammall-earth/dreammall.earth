import { gql } from 'graphql-tag'

export const getTableNameQuery = gql`
  query getTableName($tableId: Int!) {
    getTableName(tableId: $tableId)
  }
`
