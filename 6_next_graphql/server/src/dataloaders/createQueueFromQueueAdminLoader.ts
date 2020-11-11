import DataLoader from "dataloader"
import { User } from "../entities/User"
import { In } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"

// [userId]
// => [{User}]

export const createQueueFromQueueAdminLoader = () =>
  new DataLoader<number, User | null>(async (userIds: number[]) => {
    const adminQueues = await AdminQueue.find({
      where: {
        userId: In(userIds),
      },
      relations: ["queue"],
    })

    const adminUserIdsToQueue: Record<string, AdminQueue> = {}

    adminQueues.forEach((adminQueue: AdminQueue) => {
      const { userId } = adminQueue

      const currentAdminQueues = adminUserIdsToQueue[userId]

      adminUserIdsToQueue[userId] = currentAdminQueues
        ? [...currentAdminQueues, adminQueue]
        : [adminQueue]
    })

    return userIds.map((userId) => {
      return adminUserIdsToQueue[userId]?.map?.((aq) => aq.queue) || []
    })
  })
