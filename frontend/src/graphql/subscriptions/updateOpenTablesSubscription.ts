import { gql } from 'graphql-tag'

export const updateOpenTablesSubscription = gql`
  subscription ($username: String!) {
    updateOpenTables(username: $username) {
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
