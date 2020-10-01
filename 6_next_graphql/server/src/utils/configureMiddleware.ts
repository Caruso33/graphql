import cors from "cors"
import session from "express-session"
import { allowedOrigins, cookieName, __prod__, appSecret } from "./constants"

export default function configureMiddleWare(
  app: Express,
  { RedisStore, redis }
) {
  app.use(
    cors({
      origin: allowedOrigins,
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
      secret: appSecret,
      resave: false,
    })
    // in graphql need to set in order to see cookies
    // "request.credentials": "include", << was "omit" before
  )
}
