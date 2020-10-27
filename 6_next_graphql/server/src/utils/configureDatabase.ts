import connectRedis from "connect-redis"
import session from "express-session"
import Redis from "ioredis"
import path from "path"
import { Connection, ConnectionOptions, createConnection } from "typeorm"
import { Queue } from "./../entities/Queue"
import { Slip } from "./../entities/Slip"
import { User } from "./../entities/User"
import { RedisPubSub } from "graphql-redis-subscriptions"

export default async function configureDB() {
  const orm = await createConnection(getTypeOrmConfig())
  const RedisStore = connectRedis(session)

  const redis = new Redis()
  const redisPubsub = new RedisPubSub()

  return { RedisStore, redis, redisPubsub, orm }
}

const getTypeOrmConfig = (): ConnectionOptions => {
  return {
    type: "postgres",
    database: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Queue, Slip],
    migrations: [path.join(__dirname, "..", "./migrations/*")],
  }
}

export interface ConfigureDBInterface {
  RedisStore: connectRedis.RedisStore
  redis: Redis.Redis
  redisPubsub: RedisPubSub
  orm: Connection
}
