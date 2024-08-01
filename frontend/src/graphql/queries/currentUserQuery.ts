import { gql } from 'graphql-tag'

export const currentUserQuery = gql`
  query {
    currentUser {
      id
      name
      username
      table {
        id
        name
        public
        users {
          id
          role
          name
          username
        }
      }
    }
  }
`
