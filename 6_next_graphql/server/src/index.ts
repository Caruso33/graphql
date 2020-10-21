import dotenv from "dotenv"
import express from "express"
import http from "http"
import "reflect-metadata"
import configureDB, { ConfigureDBInterface } from "./utils/configureDatabase"
import configureGraphql from "./utils/configureGraphql"
import configureMiddleWare from "./utils/configureMiddleware"

const main = async () => {
  dotenv.config()

  const dbInterface: ConfigureDBInterface = await configureDB()
  const { RedisStore, redis, redisPubsub, orm } = dbInterface

  await orm.runMigrations()

  const app = express()

  configureMiddleWare(app, { RedisStore, redis })

  const { apolloServer } = await configureGraphql(app, { redis, redisPubsub })

  const httpServer = http.createServer(app)
  apolloServer.installSubscriptionHandlers(httpServer)

  const port = process.env.PORT || 4000
  httpServer.listen(port, () => {
    console.log(`
    express \t\t\t>> localhost:${port}
    apollo graphql \t\t>> http://localhost:${port}${apolloServer?.graphqlPath}
    apollo subscriptions \t>> ws://localhost:${port}${apolloServer?.subscriptionsPath}`)
  })
}

main().catch(console.error)
