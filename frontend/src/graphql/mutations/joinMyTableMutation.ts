import { gql } from 'graphql-tag'

export const joinMyTableMutation = gql`
  mutation {
    joinMyTable
  }
`

export type JoinMyTableMutationResult = {
  joinMyTable: string
}
