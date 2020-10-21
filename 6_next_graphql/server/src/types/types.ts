import { PubSub } from "apollo-server-express"
import { Request, Response } from "express"
import { Redis } from "ioredis"

export type MyContext = {
  req: Request
  res: Response
  redis: Redis
  pubsub: PubSub
}
