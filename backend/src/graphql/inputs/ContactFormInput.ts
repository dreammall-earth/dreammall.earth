import { IsEmail, MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { VALIDATION } from '#config/constants'

@InputType({ description: 'Input for the user contact form' })
export class ContactFormInput {
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

  @Field()
  @MaxLength(VALIDATION.MAX_CHARS_CONTENT)
  content: string
}
