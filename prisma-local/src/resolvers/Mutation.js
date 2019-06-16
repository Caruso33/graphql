const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.$exists.user({
      email: data.email
    });
    if (emailTaken) throw new Error("Email taken.");

    return prisma.createUser(data, info);
  },

  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.updateUser({ where: { id }, data }, info);
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.$exists.user({ id: args.id });

    if (!userExists) throw new Error("User not found");

    return prisma.deleteUser({ id: args.id });
  },

  createQueue(parent, { data }, { prisma, pubsub }, info) {
    return prisma.createQueue(data, info);
  },

  async updateQueue(parent, { id, data }, { prisma, pubsub }, info) {
    const queueExists = await prisma.$exists.queue({ id });

    if (!queueExists) throw new Error("Queue not found");

    return prisma.updateQueue({ where: { id }, data }, info);
  },

  deleteQueue(parent, { id }, { prisma, pubsub }) {
    return prisma.deleteQueue({ id });
  },

  async createSlip(parent, { data }, { prisma }, info) {
    return prisma.createSlip(
      {
        processed: false,
        how_many_before: 0,
        queue: { connect: { id: data.queue } },
        user: { connect: { id: data.user } }
      },
      info
    );
  },

  async updateSlip(parent, { id, data }, { prisma }, info) {
    const slipExists = await prisma.$exists.slip({ id });

    if (!slipExists) throw new Error("Slip not found");

    return prisma.updateSlip({ where: { id }, data }, info);
  },

  deleteSlip(parent, { id }, { prisma }) {
    return prisma.deleteSlip({ id });
  },

  createComment(parent, { data }, { prisma }, info) {
    return prisma.createComment(
      {
        title: data.title,
        body: data.body,
        queue: { connect: { id: data.queue } },
        author: { connect: { id: data.author } }
      },
      info
    );
  },

  async updateComment(parent, { id, data }, { prisma }, info) {
    const commentExists = await prisma.$exists.comment({ id });

    if (!commentExists) throw new Error("Comment not found");

    return prisma.updateComment({ where: { id }, data }, info);
  },

  deleteComment(parent, { id }, { prisma }) {
    return prisma.deleteComment(id);
  }
};

export default Mutation;
