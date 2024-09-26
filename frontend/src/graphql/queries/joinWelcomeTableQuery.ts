import { gql } from 'graphql-tag'

export const joinWelcomeTableQuery = gql`
  query {
    joinTable: joinWelcomeTable
  }
`
