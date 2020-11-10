import DataLoader from "dataloader"
import { User } from "../entities/User"

// [id]
// => [{user}]

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[])

    const userIdToUser: Record<number, User> = {}
    users.forEach((user: User) => {
      userIdToUser[user.id] = user
    })

    return userIds.map((userId) => userIdToUser[userId])
  })
