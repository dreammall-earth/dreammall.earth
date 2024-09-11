import { gql } from 'graphql-tag'

export const createTableMutation =
  gql(`mutation CreateTable($isPublic: Boolean!, $name: String!, $userIds: [Int]) {
  createTable(isPublic: $isPublic, name: $name, userIds: $userIds) {
    id
    name
    public
    users {
      id
      name
      role
    }
  }
}`)
