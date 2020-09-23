import "reflect-metadata";
import { HelloResolver } from "./resolvers"
import { __prod__ } from "./utils/constants"
import { MikroORM } from "@mikro-orm/core"
import microTask from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

const main = async () => {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const app = express()
  
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      // validate: false,
    }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })
}

main()
