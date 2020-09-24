import { User } from "./entities/User"
import { MikroORM } from "@mikro-orm/core"
import path from "path"
import { Queue } from "./entities/Queue"
import { __prod__ } from "./utils/constants"
import { Slip } from "./entities/Slip"

// accessing fields from mikro orm cli
export default {
  migrations: {
    path: path.join(__dirname + "/migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, Queue, Slip],
  dbName: "queue",
  type: "postgresql",
  user: "postgres_user",
  password: "postgres_pw",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]
