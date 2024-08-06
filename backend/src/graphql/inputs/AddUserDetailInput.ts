import { MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { VALIDATION } from '#config/constants'
import { UserDetailCategory } from '#models/UserModel'

@InputType({ description: 'Input to add user detail to the user' })
export class AddUserDetailInput {
  @Field(() => UserDetailCategory)
  category: UserDetailCategory

  @Field(() => String)
  @MaxLength(VALIDATION.MAX_CHARS_USER_DETAIL_TEXT)
  text: string
}
