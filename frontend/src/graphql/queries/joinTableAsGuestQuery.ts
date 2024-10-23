import { gql } from 'graphql-tag'

export const joinTableAsGuestQuery = gql`
  query ($tableId: String!, $userName: String!) {
    joinTableAsGuest(tableId: $tableId, userName: $userName)
  }
`
