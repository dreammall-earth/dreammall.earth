import { Resolver, Query } from 'type-graphql'

import { Hello } from '#types/Hello'

@Resolver()
export class HelloResolver {
  @Query(() => Hello)
  async hello(): Promise<Hello> {
    return new Hello('Hello world!')
  }
}
