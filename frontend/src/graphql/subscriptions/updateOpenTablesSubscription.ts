import { gql } from 'graphql-tag'

export const updateOpenTablesSubscription = gql`
  subscription ($username: String!) {
    updateOpenTables(username: $username) {
      mallTalkTables {
        id
        meetingID
        meetingName
        startTime
        participantCount
        isModerator
        attendees {
          fullName
        }
      }
      permanentTables {
        id
        meetingID
        meetingName
        startTime
        participantCount
        attendees {
          fullName
        }
        isModerator
      }
      projectTables {
        id
        meetingID
        meetingName
        startTime
        participantCount
        attendees {
          fullName
        }
        isModerator
      }
    }
  }
`
