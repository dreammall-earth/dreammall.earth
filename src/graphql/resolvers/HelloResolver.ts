import { Resolver, Query } from 'type-graphql'

import { prisma } from '#src/prisma'
import { Hello } from '#types/Hello'

@Resolver()
export class HelloResolver {
  @Query(() => Hello)
  async hello(): Promise<Hello> {
    const data = await prisma.hello.findFirst()
    return new Hello(data?.text ?? 'Hello World!')
  }
}
