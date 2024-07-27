import { gql } from 'graphql-tag'

export const joinRoomQuery = gql`
  query ($roomId: Int!, $userName: String!) {
    joinRoom(roomId: $roomId, userName: $userName)
  }
`
