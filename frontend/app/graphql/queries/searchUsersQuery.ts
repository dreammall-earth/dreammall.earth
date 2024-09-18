import { gql } from 'graphql-tag'

export const searchUsersQuery = gql`
  query ($searchString: String) {
    users(searchString: $searchString) {
      id
      name
      username
    }
  }
`
