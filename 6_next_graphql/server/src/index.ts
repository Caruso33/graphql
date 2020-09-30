import dotenv from "dotenv"
import express from "express"
import "reflect-metadata"
import { User } from "./entities/User"
import configureDB from "./utils/configureDatabase"
import configureGraphql from "./utils/configureGraphql"
import configureMiddleWare from "./utils/configureMiddleware"

const main = async () => {
  dotenv.config()

  const { RedisStore, redisClient, orm } = await configureDB()
  // await orm.em.nativeDelete(User, {})

  const app = express()

  configureMiddleWare(app, {
    RedisStore,
    redisClient,
  })

  configureGraphql(app, { orm })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`server started on localhost:${port}`)
  })
}

main()
