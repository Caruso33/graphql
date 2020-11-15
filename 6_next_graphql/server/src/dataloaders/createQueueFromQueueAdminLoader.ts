import DataLoader from "dataloader"
import { Queue } from "src/entities/Queue"
import { In } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"

// [userId]
// => [{User}]

export const createQueueFromQueueAdminLoader = () =>
  new DataLoader<number, Queue[] | null>(async (userIds) => {
    const adminQueues = await AdminQueue.find({
      where: {
        userId: In(userIds as number[]),
      },
      relations: ["queue"],
    })

    const adminUserIdsToQueue: Record<string, AdminQueue[]> = {}

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
