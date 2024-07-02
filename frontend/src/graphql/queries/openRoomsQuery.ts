import { gql } from 'graphql-tag'

export const openRoomsQuery = gql`
  query {
    openRooms {
      meetingID
      meetingName
      startTime
      participantCount
      attendees {
        fullName
      }
      joinLink
    }
  }
`
