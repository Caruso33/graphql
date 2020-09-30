import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { QueueResolver } from "../resolvers/queue"
import { UserResolver } from "../resolvers/user"
import { MyContext } from "../types"

export default async function configureGraphql(
  app: Express,
  { orm }: { orm: MikroORM<IDatabaseDriver<Connection>> }
) {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [QueueResolver, UserResolver],
      // validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  })

  apolloServer.applyMiddleware({ app, cors: false })
}
