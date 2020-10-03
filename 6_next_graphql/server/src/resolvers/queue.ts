import { Arg, Int, Mutation, Query, Resolver } from "type-graphql"
import { Queue } from "./../entities/Queue"

@Resolver()
export class QueueResolver {
  @Query(() => [Queue])
  queues(): Promise<Queue[]> {
    return Queue.find()
  }

  @Query(() => Queue, { nullable: true })
  queue(@Arg("id", () => Int) id: number): Promise<Queue | undefined> {
    return Queue.findOne(id)
  }

  @Mutation(() => Queue)
  async createQueue(@Arg("title") title: string): Promise<Queue> {
    const queue = Queue.create({ title, slips: [] }).save()
    return queue
  }

  @Mutation(() => Queue, { nullable: true })
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
