import { MikroORM } from "@mikro-orm/core"
import { ApolloServer } from "apollo-server-express"
import connectRedis from "connect-redis"
import express from "express"
import session from "express-session"
import redis from "redis"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import microTask from "./mikro-orm.config"
import { QueueResolver } from "./resolvers/queue"
import { UserResolver } from "./resolvers/user"
import { MyContext } from "./types"
import { __prod__ } from "./utils/constants"

const main = async () => {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  const app = express()

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // one month
        httpOnly: true, // don't let the FE client access the cookie
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works with https
      },
      saveUninitialized: false,
      secret: "apo3hrpoaihs3[rohs[eopkhr[3iopha[rha[pirhdl[as3ras3r",
      resave: false,
    })
    // in graphql need to set in order to see cookies
    // "request.credentials": "include", << was "omit" before
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [QueueResolver, UserResolver],
      // validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })
}

main()
