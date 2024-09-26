import { gql } from 'graphql-tag'

export const tablesQuery = gql`
  query {
    tables {
      id
      meetingID
      meetingName
      startTime
      participantCount
      attendees {
        fullName
      }
    }
  }
`
