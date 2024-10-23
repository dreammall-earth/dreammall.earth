import { MaxLength } from 'class-validator'
import { InputType, Field, Int } from 'type-graphql'

import { VALIDATION } from '#config/constants'

@InputType({ description: 'Input to update user detail of the user' })
export class UpdateUserDetailInput {
  @Field(() => Int)
  id: number

  @Field(() => String)
  @MaxLength(VALIDATION.MAX_CHARS_USER_DETAIL_TEXT)
  text: string
}
