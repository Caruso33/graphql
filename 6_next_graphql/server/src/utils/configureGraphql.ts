import { ApolloServer } from "apollo-server-express"
import { Express } from "express"
import { RedisPubSub } from "graphql-redis-subscriptions"
import { Redis } from "ioredis"
import path from "path"
import { buildSchema } from "type-graphql"
import { createQueueFromQueueAdminLoader } from "../dataloaders/createQueueFromQueueAdminLoader"
import { createSlipFromQueueLoader } from "../dataloaders/createSlipFromQueueLoader"
import { createUserFromQueueAdminLoader } from "../dataloaders/createUserFromQueueAdminLoader"
import { createUserLoader } from "../dataloaders/createUserLoader"
// import { User } from "../entities/User"
import { MyContext } from "../types/types"

export default async function configureGraphql(
  app: Express,
  { redis, redisPubsub }: { redis: Redis; redisPubsub: RedisPubSub }
) {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, "..", "resolvers") + "/**/*.{ts,js}"],
      // validate: false,
      pubSub: redisPubsub,
    }),
    subscriptions: {
      onConnect: async (_connectionParams: any, _webSocket, _context) => {
        // if (!_connectionParams?.session) {
        //   throw new Error("no session found")
        // }

        // const userId = _connectionParams!.session?.userId

        // if (!userId) {
        //   throw new Error("not authenticated")
        // }

        // const user = await User.findOne(userId)

        // if (!user) {
        //   throw new Error("user does not exist")
        // }

        console.log("Connected to websocket")
      },
      onDisconnect: () => console.log("Disconnected from websocket"),
    },
    context: ({ req, res }): MyContext => {
      return {
        req,
        res,
        redis,
        userLoader: createUserLoader(),
        slipFromQueueLoader: createSlipFromQueueLoader(),
        userFromQueueAdminLoader: createUserFromQueueAdminLoader(),
        queueFromQueueAdminLoader: createQueueFromQueueAdminLoader(),
      }
    },
  })

  apolloServer.applyMiddleware({ app, cors: false })

  return { apolloServer }
}
