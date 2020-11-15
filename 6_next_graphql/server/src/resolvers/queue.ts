import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql"
import { getConnection } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"
import { Queue } from "../entities/Queue"
import { Slip } from "../entities/Slip"
import { User } from "../entities/User"
import { isAdminOfQueue, isAuth } from "../middleware/authentication"
import { MyContext } from "../types/types"
import { isSuperAdmin } from "./../middleware/authentication"

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
  @FieldResolver(() => Slip)
  slips(@Root() queue: Queue, @Ctx() { slipFromQueueLoader }: MyContext) {
    const slips = slipFromQueueLoader.load(queue.id)

    return slips
  }

  @FieldResolver(() => [User])
  async admins(
    @Root() queue: Queue,
    @Ctx() { userFromQueueAdminLoader }: MyContext
  ) {
    return userFromQueueAdminLoader.load(queue.id)
  }

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
      // .leftJoinAndSelect("q.admins", "u")
      // .leftJoinAndSelect("q.slips", "s")
      .orderBy("q.createdAt", "DESC")
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
    return Queue.findOne(id, { relations: ["admins", "slips"] })
  }

  @Mutation(() => Queue, { nullable: true })
  @UseMiddleware(isAuth)
  async createQueue(
    @Arg("options") options: QueueInput,
    @Ctx() { req }: MyContext
  ): Promise<Queue | null> {
    const userId = req.session!.userId

    const queue = await Queue.create({ ...options, slips: [] }).save()
    await AdminQueue.create({ userId, queueId: queue.id }).save()

    req!.session!.adminOfQueues = req!.session!.adminOfQueues
      ? [...req!.session!.adminOfQueues, queue.id]
      : [queue.id]

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

  @UseMiddleware(isAuth, isSuperAdmin)
  @Mutation(() => Boolean, { nullable: true })
  async deleteQueues() {
    await Queue.remove(await Queue.find())
    return true
  }

  @UseMiddleware(isAuth, isAdminOfQueue)
  @Mutation(() => Boolean)
  async deleteQueue(@Arg("id") id: number): Promise<boolean> {
    try {
      await Queue.delete(id)

      return true
    } catch {
      return false
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Queue, { nullable: true })
  async subscribeTo(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Queue | null> {
    const userId = req.session!.userId

    const hasActiveSlipAlready = await Slip.findOne({
      where: {
        queue: {
          id: id,
        },
        active: true,
      },
    })
    if (hasActiveSlipAlready) return null

    const user = await User.findOne(userId, {
      relations: ["slips"],
    })
    if (!user) {
      console.log("no user")
      return null
    }

    const queue = await Queue.findOne(id, {
      relations: ["slips"],
    })
    if (!queue) {
      console.log("no queue")
      return null
    }

    // const slip = await getConnection()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Slip)
    //   .values([
    //     {
    //       initialQueueSize: queue?.slips?.length ?? 0,
    //       userId,
    //       user,
    //       queue,
    //     },
    //   ])
    //   .execute()

    const slip = await Slip.create({
      userId,
      user,
      queue,
      initialQueueSize: queue?.slips?.length ?? 0,
    })

    queue.slips = [...(queue.slips || []), slip]
    await queue.save()

    user.slips = [...(user.slips || []), slip]
    await user.save()

    await pubSub.publish("queue_update", queue)

    return queue
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Queue, { nullable: true })
  async unsubscribeFrom(
    @Arg("id", () => Int) id: number,
    @Arg("slipId", () => Int) slipId: number,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Queue | null> {
    const queue = await Queue.findOne(id, { relations: ["slips"] })
    if (!queue) {
      console.log("no queue")
      return null
    }

    const slip = await Slip.findOne(slipId, { relations: ["queue"] })
    if (!slip) {
      console.log("no slip")
      return null
    }

    slip.active = false // slip will still have queue relation
    await slip.save()

    // queue removes this relation though
    queue.slips = (queue.slips || []).filter((slip) => slip.id !== slipId)
    await queue.save()

    await pubSub.publish("queue_update", queue)

    return queue
  }

  // @UseMiddleware(isAuth)
  @UseMiddleware(isAuth, isAdminOfQueue)
  @Mutation(() => Queue, { nullable: true })
  async processSlip(
    @PubSub() pubSub: PubSubEngine,
    @Arg("id", () => Int) id: number,
    @Arg("slipId", () => Int, { nullable: true }) slipId?: number
  ) {
    const queue = await Queue.findOne(id, { relations: ["slips"] })
    if (!queue) {
      console.log("no queue")
      return null
    }

    if (!queue?.slips?.length || 0 > 0) {
      return null
    }

    if (!slipId) {
      slipId = queue.slips[0].id
    }

    const slip = await Slip.findOne(slipId, { relations: ["queue"] })
    if (!slip) {
      console.log("no slip")
      return null
    }

    slip.processed = true
    slip.active = false // slip will still have queue relation
    await slip.save()

    // queue removes this relation though
    queue.slips = (queue.slips || []).filter((slip) => slip.id !== slipId)
    await queue.save()

    await pubSub.publish("queue_update", queue)

    return queue
  }

  // @UseMiddleware(isAuth)
  @Subscription(() => Int, {
    topics: ["queue_update"],
    filter: ({ payload, args }) => {
      const queueId = args.id

      return payload.id === queueId
    },
  })
  queueUpdate(
    @Root() queue: Queue,
    @Arg("slipId") slipId: number,
    @Arg("id") _id: number,
    @Ctx() { req }: MyContext
  ): number {
    console.log({ req })
    const queueIndex = queue?.slips.findIndex((slip) => slip.id === slipId)

    return queueIndex
  }
}
