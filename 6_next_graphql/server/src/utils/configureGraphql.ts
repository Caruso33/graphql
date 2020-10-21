import { ApolloServer, PubSub } from "apollo-server-express"
import { Express } from "express"
import { Redis } from "ioredis"
import path from "path"
import { buildSchema } from "type-graphql"
import { MyContext } from "../types/types"

export default async function configureGraphql(
  app: Express,
  { redis }: { redis: Redis }
) {
  const pubsub = new PubSub()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // resolvers: [QueueResolver, UserResolver, SlipResolver],
      resolvers: [path.join(__dirname, "..", "resolvers") + "/**/*.{ts,js}"],
      // validate: false,
    }),
    subscriptions: {
      // path: "/subscriptions",
      // other options and hooks, like `onConnect`
      onConnect: () => console.log("Connected to websocket"),
    },
    context: ({ req, res }): MyContext => {
      return { req, res, redis, pubsub }
    },
  })

  apolloServer.applyMiddleware({ app, cors: false })

  return { apolloServer }
}
