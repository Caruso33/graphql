import { getConnection } from "typeorm"
import { isAuth } from "../middleware/isAuth"
import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { Queue } from "../entities/Queue"

@InputType()
class QueueInput {
  @Field()
  title!: string
  @Field()
  description: string
}

@ObjectType()
class PaginatedQueues {
  @Field(() => [Queue])
  queues!: Queue[]
  @Field()
  hasMore!: boolean
}

@Resolver(() => Queue)
export class QueueResolver {
  @Query(() => PaginatedQueues)
  async queues(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedQueues> {
    const realLimit = Math.min(50, limit)
    const realLimitHasMore = realLimit + 1 // to check if hasMore

    const qb = getConnection()
      .getRepository(Queue)
      .createQueryBuilder("q") // alias
      .orderBy('"createdAt"', "DESC")
      .take(realLimitHasMore)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    const queues = await qb.getMany()

    return {
      queues: queues.slice(0, realLimit),
      hasMore: queues.length === realLimitHasMore,
    }
  }

  @FieldResolver(() => String)
  descriptionSnippet(@Root() root: Queue) {
    return root.description.slice(0, 50)
  }

  @Query(() => Queue, { nullable: true })
  queue(@Arg("id", () => Int) id: number): Promise<Queue | undefined> {
    return Queue.findOne(id)
  }

  @Mutation(() => Queue)
  @UseMiddleware(isAuth)
  async createQueue(@Arg("options") options: QueueInput): Promise<Queue> {
    const queue = Queue.create({ ...options, slips: [] }).save()

    return queue
  }

  @Mutation(() => Queue, { nullable: true })
  @UseMiddleware(isAuth)
  async updateQueue(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string | undefined
  ): Promise<Queue | null> {
    const queue = await Queue.findOne(id)
    if (!queue) {
      return null
    }

    if (typeof title !== "undefined") {
      await Queue.update({ id }, { title })
    }

    return queue
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteQueue(@Arg("id") id: number): Promise<boolean> {
    try {
      await Queue.delete(id)

      return true
    } catch {
      return false
    }
  }
}
