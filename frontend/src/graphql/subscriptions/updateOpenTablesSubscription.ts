import { gql } from 'graphql-tag'

export const updateOpenTablesSubscription = gql`
  subscription ($username: String!) {
    updateOpenTables(username: $username) {
      id
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
