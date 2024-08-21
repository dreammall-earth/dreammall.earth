import { MaxLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { VALIDATION } from '#config/constants'
import { SocialMediaType } from '#models/UserModel'

@InputType({ description: 'Input to add social media to the user' })
export class AddSocialMediaInput {
  @Field(() => SocialMediaType)
  type: SocialMediaType

  @Field(() => String)
  @MaxLength(VALIDATION.MAX_CHARS_SOCIAL_MEDIA_LINK)
  link: string
}
