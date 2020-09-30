import { MikroORM } from "@mikro-orm/core"
import session from "express-session"
import microTask from "../mikro-orm.config"
import redis from "redis"
import connectRedis from "connect-redis"

export default async function configureDB() {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()
  return { RedisStore, redisClient, orm }
}
