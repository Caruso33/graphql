import connectRedis from "connect-redis"
import session from "express-session"
import Redis from "ioredis"
import path from "path"
import { ConnectionOptions, createConnection } from "typeorm"
import { Queue } from "./../entities/Queue"
import { Slip } from "./../entities/Slip"
import { User } from "./../entities/User"

export default async function configureDB() {
  const orm = await createConnection(typeOrmConfig)

  await orm.runMigrations()

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  return { RedisStore, redis, orm }
}

const typeOrmConfig: ConnectionOptions = {
  type: "postgres",
  database: "queue",
  username: "postgres_user",
  password: "postgres_pw",
  logging: true,
  synchronize: true,
  entities: [User, Queue, Slip],
  migrations: [path.join(__dirname, "..", "./migrations/*")],
}
