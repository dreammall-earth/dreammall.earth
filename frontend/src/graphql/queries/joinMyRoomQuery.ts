import { gql } from 'graphql-tag'

export const joinMyRoomQuery = gql`
  query {
    joinMyRoom
  }
`

export type JoinMyRoomQueryResult = {
  joinMyRoom: string
}
