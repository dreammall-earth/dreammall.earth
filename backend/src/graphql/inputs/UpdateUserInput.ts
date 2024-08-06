import { MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { VALIDATION } from '#config/constants'
import { UserAvailability } from '#models/UserModel'

@InputType({ description: 'Input to update the basic data of the user' })
export class UpdateUserInput {
  @Field(() => String)
  @MaxLength(VALIDATION.MAX_CHARS_NAME)
  name: string

  @Field(() => String, { nullable: true })
  @MaxLength(VALIDATION.MAX_CHARS_INTRODUCTION)
  introduction?: string | null

  @Field(() => UserAvailability, { nullable: true })
  availability?: UserAvailability | null
}
