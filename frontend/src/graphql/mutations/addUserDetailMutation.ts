import { gql } from 'graphql-tag'

export type AddUserDetailInput = {
  text: string
  category: 'place' | 'work' | 'language' | 'education' | 'feeling'
}

export const addUserDetailMutation = gql`
  mutation addUserDetail($data: AddUserDetailInput!) {
    addUserDetail(data: $data) {
      id
      text
      category
    }
  }
`

export type AddUserDetailMutationResult = {
  addUserDetail: AddUserDetailInput & {
    id: number
  }
}
