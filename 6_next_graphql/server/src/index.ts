import dotenv from "dotenv"
import express from "express"
import "reflect-metadata"
import configureDB from "./utils/configureDatabase"
import configureGraphql from "./utils/configureGraphql"
import configureMiddleWare from "./utils/configureMiddleware"

const main = async () => {
  dotenv.config()

  const app = express()

  const { RedisStore, redis, orm } = await configureDB()
  await orm.runMigrations()

  configureMiddleWare(app, { RedisStore, redis })

  configureGraphql(app, { orm, redis })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`server started on localhost:${port}`)
  })
}

main()
