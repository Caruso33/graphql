import http from "http"
import { Redis } from "ioredis"
import { RedisStore } from "connect-redis"
import dotenv from "dotenv"
import express from "express"
import "reflect-metadata"
import configureDB from "./utils/configureDatabase"
import configureGraphql from "./utils/configureGraphql"
import configureMiddleWare from "./utils/configureMiddleware"
import { Connection } from "typeorm"

const main = async () => {
  dotenv.config()

  const {
    RedisStore,
    redis,
    orm,
  }: {
    RedisStore: RedisStore
    redis: Redis
    orm: Connection
  } = await configureDB()
  await orm.runMigrations()

  const app = express()

  configureMiddleWare(app, { RedisStore, redis })

  const { apolloServer } = await configureGraphql(app, { redis })

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

main()
