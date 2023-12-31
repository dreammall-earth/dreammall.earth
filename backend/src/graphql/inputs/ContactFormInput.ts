import { IsEmail, MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

// values according to prisma/schema.prisma
const MAX_CHARS_FIRST_NAME = 50
const MAX_CHARS_LAST_NAME = 50
const MAX_CHARS_EMAIL = 255
const MAX_CHARS_CONTENT = 255

@InputType({ description: 'Input for the user contact form' })
export class ContactFormInput {
  @Field()
  @MaxLength(MAX_CHARS_FIRST_NAME)
  firstName: string

  @Field()
  @MaxLength(MAX_CHARS_LAST_NAME)
  lastName: string

  @Field()
  @IsEmail()
  @MaxLength(MAX_CHARS_EMAIL)
  email: string

  @Field()
  @MaxLength(MAX_CHARS_CONTENT)
  content: string
}
