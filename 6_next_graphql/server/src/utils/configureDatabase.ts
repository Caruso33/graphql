import { MikroORM } from "@mikro-orm/core"
import session from "express-session"
import microTask from "../mikro-orm.config"
import Redis from "ioredis"
import connectRedis from "connect-redis"

export default async function configureDB() {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const RedisStore = connectRedis(session)
  const redis = new Redis()
  return { RedisStore, redis, orm }
}
