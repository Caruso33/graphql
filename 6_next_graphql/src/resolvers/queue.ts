import { MyContext } from "./../types"
import { Queue } from "./../entities/Queue"
import { Resolver, Query, Ctx } from "type-graphql"

@Resolver()
export class QueueResolver {
  @Query(() => [Queue])
  queues(@Ctx() { em }: MyContext): Promise<Queue[]> {
    return em.find(Queue, {})
  }
}
