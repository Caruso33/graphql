import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { QueueResolver } from "../resolvers/queue"
import { UserResolver } from "../resolvers/user"
import { MyContext } from "../types"

export default async function configureGraphql(app: Express, { orm, redis }) {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [QueueResolver, UserResolver],
      // validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({ app, cors: false })
}
