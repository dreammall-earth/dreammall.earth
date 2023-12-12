import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class Hello {
  constructor(msg: string) {
    this.hello = msg
  }

  @Field(() => String)
  hello: string
}
