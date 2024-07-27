import { gql } from 'graphql-tag'

export const updateOpenRoomsSubscription = gql`
  subscription ($username: String!) {
    updateOpenRooms(username: $username) {
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
