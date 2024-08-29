import { gql } from '@apollo/client'

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
