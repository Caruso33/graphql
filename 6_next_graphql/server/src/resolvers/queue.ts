import { MyContext } from "./../types"
import { Queue } from "./../entities/Queue"
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql"

@Resolver()
export class QueueResolver {
  @Query(() => [Queue])
  queues(@Ctx() { em }: MyContext): Promise<Queue[]> {
    return em.find(Queue, {})
  }

  @Query(() => Queue, { nullable: true })
  queue(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Queue | null> {
    return em.findOne(Queue, { id })
  }

  @Mutation(() => Queue)
  async createQueue(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Queue> {
    const queue = em.create(Queue, { title })
    await em.persistAndFlush(queue)
    return queue
  }

  @Mutation(() => Queue, { nullable: true })
  async updateQueue(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string | null,
    @Ctx() { em }: MyContext
  ): Promise<Queue | null> {
    const queue = await em.findOne(Queue, { id })
    if (!queue) {
      return null
    }

    if (typeof title !== "undefined") queue.title = title!

    await em.persistAndFlush(queue)

    return queue
  }

  @Mutation(() => Boolean)
  async deleteQueue(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Queue, { id })
      return true
    } catch {
      return false
    }
  }
}
