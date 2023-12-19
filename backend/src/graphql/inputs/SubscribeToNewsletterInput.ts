import { IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType({ description: 'Input for the newsletter subscription form' })
export class SubscribeToNewsletterInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  @IsEmail()
  email: string
}
