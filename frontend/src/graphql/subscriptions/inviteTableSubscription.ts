import { gql } from 'graphql-tag'

export const inviteTableSubscription = gql`
  subscription {
    inviteTable {
      table {
        id
        meetingID
        meetingName
        startTime
        participantCount
        isModerator
      }
      user {
        id
        name
        username
      }
    }
  }
`
