import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.bindings.mutation.updateUser({ where: { id }, data }, info)
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.client.$exists.user({ id: args.id })

    if (!userExists) throw new Error("User not found")

    return prisma.bindings.mutation.deleteUser({ where: { id: args.id } }, info)
  },

  createQueue(parent, { data }, { prisma }, info) {
    return prisma.bindings.mutation.createQueue({ data }, info)
  },

  async updateQueue(parent, { id, data }, { prisma }, info) {
    const queueExists = await prisma.client.$exists.queue({ id })

    if (!queueExists) throw new Error("Queue not found")

    return prisma.bindings.mutation.updateQueue({ where: { id }, data }, info)
  },

  deleteQueue(parent, { id }, { prisma }, info) {
    return prisma.bindings.mutation.deleteQueue({ where: { id } }, info)
  },

  async createSlip(parent, { data }, { prisma }, info) {
    return prisma.bindings.mutation.createSlip(
      {
        data: {
          processed: false,
          how_many_before: 0,
          queue: { connect: { id: data.queue } },
          user: { connect: { id: data.user } }
        }
      },
      info
    )
  },

  async updateSlip(parent, { id, data }, { prisma }, info) {
    const slipExists = await prisma.client.$exists.slip({ id })

    if (!slipExists) throw new Error("Slip not found")

    return prisma.bindings.mutation.updateSlip({ where: { id }, data }, info)
  },

  deleteSlip(parent, { id }, { prisma }, info) {
    return prisma.bindings.mutation.deleteSlip({ where: { id } }, info)
  },

  createComment(parent, { data }, { prisma }, info) {
    return prisma.bindings.mutation.createComment(
      {
        data: {
          title: data.title,
          body: data.body,
          queue: { connect: { id: data.queue } },
          author: { connect: { id: data.author } }
        }
      },
      info
    )
  },

  async updateComment(parent, { id, data }, { prisma }, info) {
    const commentExists = await prisma.client.$exists.comment({ id })

    if (!commentExists) throw new Error("Comment not found")

    return prisma.bindings.mutation.updateComment({ where: { id }, data }, info)
  },

  deleteComment(parent, { id }, { prisma }, info) {
    return prisma.bindings.mutation.deleteComment({ where: { id } }, info)
  }
}

export default Mutation
