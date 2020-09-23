import { MikroORM } from "@mikro-orm/core"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import microTask from "./mikro-orm.config"
import { QueueResolver } from "./resolvers/queue"
import { UserResolver } from "./resolvers/user"

const main = async () => {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [QueueResolver, UserResolver],
      // validate: false,
    }),
    context: () => ({ em: orm.em }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })
}

main()
