import { IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType({ description: 'Input for the user contact form' })
export class ContactFormInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  content: string

  @Field()
  acceptedDSGVO: boolean
}
