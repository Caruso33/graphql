import { MikroORM } from "@mikro-orm/core"
import path from "path"
import { Queue } from "./entities/Queue"
import { __prod__ } from "./utils/constants"

// accessing fields from mikro orm cli
export default {
  migrations: {
    path: path.join(__dirname + "/migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Queue],
  dbName: "queue",
  type: "postgresql",
  user: 'postgres_user',
  password: 'postgres_pw',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]
