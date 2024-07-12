import { User as DbUser } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

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
