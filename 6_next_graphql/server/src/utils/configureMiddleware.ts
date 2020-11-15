import { RedisStore } from "connect-redis"
import cors from "cors"
import { Express } from "express"
import session from "express-session"
import { Redis } from "ioredis"
import { cookieName, __prod__ } from "./constants"

interface RedisInterface {
  RedisStore: RedisStore
  redis: Redis
}

export default function configureMiddleWare(
  app: Express,
  other: RedisInterface
) {
  const { RedisStore, redis } = other

  app.use(
    cors({
      origin: process.env.FRONTEND_DOMAIN,
      credentials: true,
    })
  )
  app.use(
    session({
      name: cookieName,
      store: new RedisStore({ client: redis }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // one month
        httpOnly: true, // don't let the FE client access the cookie
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works with https
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
    // in graphql need to set in order to see cookies
    // "request.credentials": "include", << was "omit" before
  )
}
