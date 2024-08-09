import { Resolver, Query, FieldResolver, Authorized } from 'type-graphql'

import { AdminDashboardModel } from '#graphql/models/AdminDashboardModel'
import { prisma } from '#src/prisma'

@Authorized('admin')
@Resolver(AdminDashboardModel)
export class AdminDashboardResolver {
  @Query(() => AdminDashboardModel)
  adminDashboard(): AdminDashboardModel {
    return new AdminDashboardModel()
  }

  @FieldResolver()
  users() {
    return prisma.user.findMany()
  }
}
