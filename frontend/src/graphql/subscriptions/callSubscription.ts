import { gql } from 'graphql-tag'

export const callSubscription = gql`
  subscription {
    call {
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
