import { gql } from 'graphql-tag'

export const openTablesQuery = gql`
  query {
    openTables {
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
