import {
  User as DbUser,
  UserDetail as DbUserDetail,
  SocialMedia as DbScoialMedia,
} from '@prisma/client'
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql'

import { UsersWithMeetings, UserWithProfile } from '#src/prisma'

import { Table } from './TableModel'

export enum UserDetailCategory {
  'place' = 'place',
  'work' = 'work',
  'language' = 'language',
  'education' = 'education',
  'feeling' = 'feeling',
}

export enum SocialMediaType {
  'discord' = 'discord',
  'telegram' = 'telegram',
  'facebook' = 'facebook',
  'tiktok' = 'tiktok',
  'snapchat' = 'snapchat',
  'reddit' = 'reddit',
  'wechat' = 'wechat',
  'instagram' = 'instagram',
  'pintarest' = 'pintarest',
  'linkedin' = 'linkedin',
  'youtube' = 'youtube',
  'whatsapp' = 'whatsapp',
  'xing' = 'xing',
  'x' = 'x',
}

export enum UserAvailability {
  'available' = 'available',
  'partly_available' = 'partly_available',
  'busy' = 'busy',
}

registerEnumType(SocialMediaType, {
  name: 'SocialMediaType',
  description: 'Type of social media, e.g. telegram or discord',
})

registerEnumType(UserDetailCategory, {
  name: 'UserDetailCategory',
  description: 'Category of user detail, e.g. work or education',
})

registerEnumType(UserAvailability, {
  name: 'UserAvailability',
  description: 'Availability of the user, e.g. busy',
})

@ObjectType()
export class User {
  constructor(user: DbUser) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string
}

@ObjectType()
export class UserDetail {
  constructor(userDetail: DbUserDetail) {
    this.category = userDetail.category as UserDetailCategory
    this.text = userDetail.text
  }

  @Field(() => UserDetailCategory)
  category: UserDetailCategory

  @Field()
  text: string
}

@ObjectType()
export class SocialMedia {
  constructor(socialMedia: DbScoialMedia) {
    this.type = socialMedia.type as SocialMediaType
    this.link = socialMedia.link
  }

  @Field(() => SocialMediaType)
  type: SocialMediaType

  @Field()
  link: string
}

@ObjectType()
export class CurrentUser {
  constructor(user: UserWithProfile, users: UsersWithMeetings[]) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
    this.introduction = user.introduction
    this.availability = user.availability as UserAvailability

    this.details = user.userDetail.map((d) => new UserDetail(d))
    this.social = user.socialMedia.map((s) => new SocialMedia(s))
    this.table = user.meeting ? new Table(user.meeting, users) : null
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string

  @Field(() => String, { nullable: true })
  introduction: string | null

  @Field(() => UserAvailability, { nullable: true })
  availability: UserAvailability | null

  @Field(() => [UserDetail])
  details: UserDetail[]

  @Field(() => [SocialMedia])
  social: SocialMedia[]

  @Field(() => Table, { nullable: true })
  table: Table | null
}
