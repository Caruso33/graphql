import { Request, Response } from "express"
import { Redis } from "ioredis"
import { createUserLoader } from "../dataloaders/createUserLoader"
import { createSlipFromQueueLoader } from "../dataloaders/createSlipFromQueueLoader"
import { createUserFromQueueLoader } from "../dataloaders/createUserFromQueueAdmin"

export type MyContext = {
  req: Request
  res: Response
  redis: Redis
  userLoader: ReturnType<typeof createUserLoader>
  slipFromQueueLoader: ReturnType<typeof createSlipFromQueueLoader>
  userFromQueueLoader: ReturnType<typeof createUserFromQueueLoader>
}
