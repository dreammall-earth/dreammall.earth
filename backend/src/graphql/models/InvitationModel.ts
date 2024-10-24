import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Invitation {
  constructor(name: string) {
    this.name = name
  }

  @Field()
  name: string
}
