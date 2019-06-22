import getUserId from "../utils/getUserId"

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {}

    if (args.query)
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      }
    return prisma.bindings.query.users(opArgs, info)
  },
  queues(parent, args, { prisma }, info) {
    const opArgs = {}
    if (args.query) opArgs.where = { title_contains: args.query }

    return prisma.bindings.query.queues(opArgs, info)
  },

  slips(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = { where: { user: { id: userId } } }
    if (args.query) opArgs.where = { title_contains: args.query }

    return prisma.bindings.query.slips(opArgs, info)
  },

  comments(parent, args, { prisma, request }, info) {
    getUserId(request)
    // TODO: show only comments for queues I am in
    const opArgs = {}
    if (args.query) opArgs.where = { title_contains: args.query }

    return prisma.bindings.query.comments(opArgs, info)
  },

  me() {
    return {
      id: "123-456",
      name: "Tobsn",
      email: "caruso33@web.de"
    }
  }
}

export default Query
