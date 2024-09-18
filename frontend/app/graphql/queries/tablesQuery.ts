import { gql } from 'graphql-tag'

export const tablesQuery = gql(`{
  tables {
    id
    name
    public
    users {
      id
      name
      role
      username
    }
  }
}`)
