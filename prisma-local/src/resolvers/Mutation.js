import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import getUserId from "../utils/getUserId"

const Mutation = {
  async login(parent, { data }, { prisma }, info) {
    const user = await prisma.bindings.query.user({
      where: { email: data.email }
    })
    if (!user) throw new Error("No user found.")

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) throw new Error("Unable to login.")

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    }
  },
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.client.$exists.user({
      email: data.email
    })
    if (emailTaken) throw new Error("Email taken.")

    if (data.password.length < 8)
      throw Error("Password does not satisfy requirements")

    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    )

    const user = await prisma.bindings.mutation.createUser({
      data: { ...data, password }
    }) // LEAVE __INFO__ FIELD OFF WHEN CREATING CUSTOM OBJECTS

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    }
  },

  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.bindings.mutation.updateUser(
      { where: { id: userId }, data },
      info
    )
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const userExists = await prisma.client.$exists.user({ id: userId })

    if (!userExists) throw new Error("User not found")

    return prisma.bindings.mutation.deleteUser({ where: { id: userId } }, info)
  },

  createQueue(parent, { data }, { prisma, request }, info) {
    getUserId(request)

    return prisma.bindings.mutation.createQueue({ data }, info)
  },

  async updateQueue(parent, { id, data }, { prisma, request }, info) {
    getUserId(request)

    const queueExists = await prisma.client.$exists.queue({ id })
    if (!queueExists) throw new Error("Queue not found")

    return prisma.bindings.mutation.updateQueue({ where: { id }, data }, info)
  },

  deleteQueue(parent, { id }, { prisma, request }, info) {
    getUserId(request)

    return prisma.bindings.mutation.deleteQueue({ where: { id } }, info)
  },

  createSlip(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.bindings.mutation.createSlip(
      {
        data: {
          processed: false,
          how_many_before: 0,
          queue: { connect: { id: data.queue } },
          user: { connect: { id: userId } }
        }
      },
      info
    )
  },

  async updateSlip(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const slipExists = await prisma.client.$exists.slip({
      id,
      user: { id: userId }
    })

    if (!slipExists) throw new Error("Slip not found")

    return prisma.bindings.mutation.updateSlip(
      { where: { id }, data: { queue: { connect: { id: data.queue } } } },
      info
    )
  },

  async deleteSlip(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const slipExists = await prisma.client.$exists.slip({
      id,
      user: { id: userId }
    })

    if (!slipExists) throw new Error("Slip not found")

    return prisma.bindings.mutation.deleteSlip({ where: { id } }, info)
  },

  createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.bindings.mutation.createComment(
      {
        data: {
          title: data.title,
          body: data.body,
          queue: { connect: { id: data.queue } },
          author: { connect: { id: userId } }
        }
      },
      info
    )
  },

  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.client.$exists.comment({
      id,
      author: { id: userId }
    })

    if (!commentExists) throw new Error("Comment not found")

    return prisma.bindings.mutation.updateComment({ where: { id }, data }, info)
  },

  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.bindings.exists.Comment({
      id,
      author: { id: userId }
    })

    if (!commentExists) throw new Error("Comment not found")

    return prisma.bindings.mutation.deleteComment({ where: { id } }, info)
  }
}

export default Mutation
