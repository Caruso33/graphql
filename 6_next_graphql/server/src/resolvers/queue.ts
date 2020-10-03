import { isAuth } from "../middleware/isAuth"
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { Queue } from "../entities/Queue"

@InputType()
class QueueInput {
  @Field()
  title!: string
  @Field()
  description!: string
}

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
