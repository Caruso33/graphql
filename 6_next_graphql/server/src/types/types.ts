import { Request, Response } from "express"
import { Redis } from "ioredis"
import { createQueueFromQueueAdminLoader } from "../dataloaders/createQueueFromQueueAdminLoader"
import { createSlipFromQueueLoader } from "../dataloaders/createSlipFromQueueLoader"
import { createUserFromQueueAdminLoader } from "../dataloaders/createUserFromQueueAdminLoader"
import { createUserLoader } from "../dataloaders/createUserLoader"

export type MyContext = {
  req: Request
  res: Response
  redis: Redis
  userLoader: ReturnType<typeof createUserLoader>
  slipFromQueueLoader: ReturnType<typeof createSlipFromQueueLoader>
  userFromQueueAdminLoader: ReturnType<typeof createUserFromQueueAdminLoader>
  queueFromQueueAdminLoader: ReturnType<typeof createQueueFromQueueAdminLoader>
}
