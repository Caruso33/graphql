import DataLoader from "dataloader"
import { In } from "typeorm"
import { AdminQueue } from "../entities/AdminQueue"
import { User } from "../entities/User"

// [queueId]
// => [{User}]

export const createUserFromQueueAdminLoader = () =>
  new DataLoader<number, User[] | null>(async (queueIds) => {
    const adminQueues = await AdminQueue.find({
      where: {
        queueId: In(queueIds as number[]),
      },
      relations: ["user"],
    })

    const adminQueueIdsToUser: Record<string, AdminQueue[]> = {}

    adminQueues.forEach((adminQueue: AdminQueue) => {
      const { queueId } = adminQueue

      const currentAdminQueues = adminQueueIdsToUser[queueId]

      adminQueueIdsToUser[queueId] = currentAdminQueues
        ? [...currentAdminQueues, adminQueue]
        : [adminQueue]
    })

    return queueIds.map((queueId) => {
      const queueAdmins = adminQueueIdsToUser[queueId]

      const queueAdminUsers = queueAdmins?.map?.((aq) => aq.user) || []

      return queueAdminUsers
    })
  })
