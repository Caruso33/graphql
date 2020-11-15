import { User } from "../entities/User"
import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../types/types"

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticated")
  }

  return next()
}

export const isAdminOfQueue: MiddlewareFn<MyContext> = async (
  { args, context },
  next
) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticated")
  }

  const user = await User.findOne(context.req.session.userId, {
    relations: ["adminOfQueues"],
  })

  if (user?.isSuperAdmin) return next()

  const adminOfQueues =
    user?.adminOfQueues?.map?.((adminQueue) => adminQueue.queueId) || []

  if (!adminOfQueues?.includes?.(args?.id)) {
    throw new Error("not admin of queue")
  }

  return next()
}

export const isSuperAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticated")
  }

  if (!context.req.session?.isSuperAdmin) {
    throw new Error("not super admin")
  }

  return next()
}
