import { IsEmail, MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { VALIDATION } from '#config/constants'

@InputType({ description: 'Input for the newsletter subscription form' })
export class SubscribeToNewsletterInput {
  @Field()
  @MaxLength(VALIDATION.MAX_CHARS_FIRST_NAME)
  firstName: string

  @Field()
  @MaxLength(VALIDATION.MAX_CHARS_LAST_NAME)
  lastName: string

  @Field()
  @IsEmail()
  @MaxLength(VALIDATION.MAX_CHARS_EMAIL)
  email: string
}
