import { gql } from 'graphql-tag'

export const joinTableAsGuestQuery = gql`
  query ($tableId: Int!, $userName: String!) {
    joinTableAsGuest(tableId: $tableId, userName: $userName)
  }
`
