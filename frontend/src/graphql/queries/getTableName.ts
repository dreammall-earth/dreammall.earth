import { gql } from 'graphql-tag'

export const getTableNameQuery = gql`
  query getTableName($tableId: String!) {
    getTableName(tableId: $tableId)
  }
`
