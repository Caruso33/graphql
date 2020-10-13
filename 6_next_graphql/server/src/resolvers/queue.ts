import {
  Arg,
  Ctx,
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
import { getConnection } from "typeorm"
import { Queue } from "../entities/Queue"
import { Slip } from "../entities/Slip"
import { User } from "../entities/User"
import { isAuth } from "../middleware/isAuth"
import { MyContext } from "./../types"

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
      .leftJoinAndSelect("q.admins", "u")
      .leftJoinAndSelect("q.slips", "s")
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
    const user = await User.findOne(userId)

    if (!user) return null

    const queue = await Queue.create({
      ...options,
      slips: [],
      admins: [user],
    }).save()

    user.adminOfQueues = [...(user.adminOfQueues || []), queue]
    await user.save()

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

  @UseMiddleware(isAuth)
  @Mutation(() => Queue)
  async subscribeTo(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<Queue | null> {
    const userId = req.session!.userId

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

    return queue
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Queue)
  async unsubscribeFrom(
    @Arg("id") id: number,
    @Arg("slipId") slipId: number
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

    return queue
  }
}
