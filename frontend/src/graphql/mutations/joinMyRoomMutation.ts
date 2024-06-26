import { gql } from 'graphql-tag'

export const joinMyRoomMutation = gql`
  mutation {
    joinMyRoom
  }
`

export type JoinMyRoomMutationResult = {
  joinMyRoom: string
}
