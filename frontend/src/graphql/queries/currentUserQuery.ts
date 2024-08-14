import { gql } from 'graphql-tag'

export const currentUserQuery = gql`
  query {
    currentUser {
      id
      name
      username
      introduction
      availability
      details {
        id
        category
        text
      }
      social {
        id
        type
        link
      }
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
