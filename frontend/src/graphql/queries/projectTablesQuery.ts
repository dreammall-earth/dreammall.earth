import { gql } from 'graphql-tag'

export const projectTablesQuery = gql(`{
  projectTables {
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
