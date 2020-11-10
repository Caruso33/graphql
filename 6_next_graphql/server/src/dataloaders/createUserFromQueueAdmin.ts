import DataLoader from "dataloader"
import { User } from "../entities/User"
import { In } from "typeorm"

// [queueId]
// => [{User}]

export const createUserFromQueueLoader = () =>
  new DataLoader<number, User>(async (queueIds) => {
    const users = await User.find({
      join: {
        alias: "userQueue",
        innerJoinAndSelect: {
          adminOfQueues: "userQueue.adminOfQueues",
        },
      },
      where: { adminOfQueues: In(queueIds as number[]) },
    })

    console.log({ users })

    const userIdToUser: Record<number, User> = {}
    users.forEach((user: User) => {
      const usersQueues = user.adminOfQueues
      usersQueues.forEach((userQueue) => {
        const userQueueId = userQueue.id

        userIdToUser[userQueueId] = userIdToUser[userQueueId]
          ? [...userIdToUser[userQueueId], user]
          : [user]
      })
    })

    return queueIds.map((queueId) => userIdToUser[queueId])
  })

  // const users = await User.find({
  //   join: {
  //     alias: "userQueue",
  //     innerJoinAndSelect: {
  //       sdf: "userQueue.adminOfQueues",
  //     },
  //   },
  //   where: { adminOfQueues: In(queueIds as number[]) },
  //   relations: ["adminOfQueues"],
  // })