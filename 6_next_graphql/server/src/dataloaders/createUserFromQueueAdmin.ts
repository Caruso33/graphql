import DataLoader from "dataloader"
import { User } from "../entities/User"
import { In } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"

// [queueId, userId]
// => [{User}]

interface AdminQueueDataloaderKey {
  queueId: number
  userId: number
}

export const createUserFromQueueLoader = () =>
  new DataLoader<AdminQueueDataloaderKey, User | null>(async (keys) => {
    const adminQueues = await AdminQueue.findByIds(keys as any)

    console.log({ adminQueues })

    const adminQueueIdsToUser: Record<string, AdminQueue> = {}

    adminQueues.forEach((adminQueue: AdminQueue) => {
      const adminQueueId = `${adminQueue.userId}__${adminQueue.queueId}`

      adminQueueIdsToUser[adminQueueId] = adminQueue
    })

    return keys.map((adminQueue: AdminQueueDataloaderKey) => {
      const adminQueueId = `${adminQueue.userId}__${adminQueue.queueId}`

      return adminQueueIdsToUser[adminQueueId]
    })
  })
