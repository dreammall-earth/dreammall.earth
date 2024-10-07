import { gql } from 'graphql-tag'

export const callSubscription = gql`
  subscription {
    inviteCall {
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
