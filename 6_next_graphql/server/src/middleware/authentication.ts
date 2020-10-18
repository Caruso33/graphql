import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../types/types"

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticatd")
  }

  return next()
}

export const isAdminOfQueue: MiddlewareFn<MyContext> = (
  { args, context },
  next
) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticatd")
  }

  if (
    !context.req.session?.adminOfQueues ||
    !context.req.session.adminOfQueues.includes(args?.id)
  ) {
    throw new Error("not admin of queue")
  }

  return next()
}

export const isSuperAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session?.userId) {
    throw new Error("not authenticatd")
  }

  if (!context.req.session?.isSuperAdmin) {
    throw new Error("not super admin")
  }

  return next()
}
