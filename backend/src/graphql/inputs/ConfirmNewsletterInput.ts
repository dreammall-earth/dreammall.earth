import { Length } from 'class-validator'
import { InputType, Field } from 'type-graphql'

// values according to prisma/schema.prisma
const CODE_LENGTH = 16 // See here for improvement possibilities https://github.com/prisma/prisma/issues/5018

@InputType({ description: 'Input for the email newsletter opt-in confirmation' })
export class ConfirmNewsletterInput {
  @Field()
  @Length(CODE_LENGTH, CODE_LENGTH)
  code: string
}
