import { gql } from 'graphql-tag'

export const deleteTableMutation = gql(`mutation DeleteTable($tableId: Int!) {
  deleteTable(tableId: $tableId)
}`)
