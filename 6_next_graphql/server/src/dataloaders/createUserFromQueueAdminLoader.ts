import DataLoader from "dataloader"
import { In } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"
import { User } from "../entities/User"

// [queueId]
// => [{User}]

export const createUserFromQueueAdminLoader = () =>
  new DataLoader<number, User | null>(async (queueIds: number[]) => {
    const adminQueues = await AdminQueue.find({
      where: {
        queueId: In(queueIds),
      },
      relations: ["user"],
    })

    const adminQueueIdsToUser: Record<string, AdminQueue> = {}

    adminQueues.forEach((adminQueue: AdminQueue) => {
      const { queueId } = adminQueue

      const currentAdminQueues = adminQueueIdsToUser[queueId]

      adminQueueIdsToUser[queueId] = currentAdminQueues
        ? [...currentAdminQueues, adminQueue]
        : [adminQueue]
    })

    return queueIds.map((queueId) => {
      return adminQueueIdsToUser[queueId]?.map?.((aq) => aq.user) || []
    })
  })
