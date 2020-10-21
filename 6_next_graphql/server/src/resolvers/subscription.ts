import {
  PubSub,
  Ctx,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
  PubSubEngine,
  ResolverFilterData,
  Root,
  Arg,
} from "type-graphql"

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  message?: string

  @Field(() => Date)
  date: Date
}

export interface NotificationPayload {
  id: number
  message?: string
}

@Resolver()
export default class SubscriptionResolver {
  @Query(() => String)
  async hello(@Ctx() ctx: any) {
      console.log(ctx.pubsub.publish)
    await ctx.pubsub.publish("MESSAGES")

    return "Hello World"
  }

  @Subscription(() => String, {
    topics: "MESSAGES",
  })
  async subscription(): Promise<any> {
    console.log("here")

    return "something"
  }

  private autoIncrement = 0

  @Mutation((returns) => Boolean)
  async pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg("message", { nullable: true }) message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message }
    await pubSub.publish("NOTIFICATIONS", payload)
    return true
  }

  @Mutation((returns) => Boolean)
  async publisherMutation(
    @Arg("message", { nullable: true }) message?: string
  ): Promise<boolean> {
    await publish({ id: ++this.autoIncrement, message })
    return true
  }

  @Subscription({ topics: "NOTIFICATIONS" })
  normalSubscription(
    @Root() { id, message }: NotificationPayload
  ): Notification {
    return { id, message, date: new Date() }
  }

  @Subscription((returns) => Notification, {
    topics: "NOTIFICATIONS",
    filter: ({ payload }: ResolverFilterData<NotificationPayload>) =>
      payload.id % 2 === 0,
  })
  subscriptionWithFilter(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() }
    return newNotification
  }

  @Mutation((returns) => Boolean)
  async pubSubMutationToDynamicTopic(
    @Arg("topic") topic: string,
    PubSub,
    @Arg("message", { nullable: true }) message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message }
    await pubSub.publish(topic, payload)
    return true
  }

  @Subscription({
    topics: ({ args }) => args.topic,
  })
  subscriptionWithFilterToDynamicTopic(
    @Arg("topic") topic: string,
    @Root() { id, message }: NotificationPayload
  ): Notification {
    return { id, message, date: new Date() }
  }
}
