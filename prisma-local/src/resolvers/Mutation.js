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

  async createQueue(parent, { data }, { prisma, pubsub }, info) {
    const queue = await prisma.createQueue(data, info);
    pubsub.publish("queue", { queue: { mutation: "CREATED", data: queue } });
    return queue;
  },

  async updateQueue(parent, { id, data }, { prisma, pubsub }, info) {
    const queueExists = prisma.$exists.queue({ id });

    if (!queueExists) throw new Error("Queue not found");

    const queue = await prisma.updateQueue({ where: { id }, data }, info);
    pubsub.publish("queue", { queue: { mutation: "UPDATED", data: queue } });
    return queue;
  },

  async deleteQueue(parent, { id }, { prisma, pubsub }) {
    const queue = await prisma.deleteQueue({ id });
    pubsub.publish("queue", {
      queue: { mutation: "DELETED", data: queue }
    });
    return queue;
  },

  async createSlip(parent, { data }, { prisma }, info) {
    const dat = { ...data, processed: false, how_many_before: 0 };
    const slip = await prisma.createSlip(dat, info);
    pubsub.publish("slip", { slip: { mutation: "CREATED", data: slip } });
    return slip;
  },

  async updateSlip(parent, { id, data }, { prisma }, info) {
    const slipExists = prisma.$exists.slip({ id });

    if (!slipExists) throw new Error("Slip not found");

    const slip = await prisma.updateSlip(data, info);
    pubsub.publish("slip", { slip: { mutation: "UPDATED", data: slip } });
    return slip;
  },

  async deleteSlip(parent, { id }, { prisma, pubsub }) {
    const slip = await prisma.deleteSlip(id);
    pubsub.publish("slip", {
      slip: { mutation: "DELETED", data: slip }
    });
    return slip;
  },

  createComment(parent, args, { pubsub, db }) {
    const { queue, user } = args.data;

    const userExists = db.users.some(u => u.id === user);
    const queueExists = db.queues.some(q => q.id === queue);

    if (!userExists) throw new Error("User does not exist");
    else if (!queueExists) throw new Error("Queue does not exist");

    const comment = {
      id: db.COUNTER_OF_IDS,
      ...args.data
    };
    db.comments.push(comment);
    pubsub.publish(`comment: ${args.data.queue}`, {
      comment: { mutation: "CREATED", data: comment }
    });

    const userIndex = db.users.findIndex(u => u.id === user);
    db.users[userIndex].comments.push(db.COUNTER_OF_IDS);

    const queueIndex = db.queues.findIndex(q => q.id === queue);
    db.queues[queueIndex].comments.push(db.COUNTER_OF_IDS);

    db.COUNTER_OF_IDS++;
    return comment;
  },
  updateComment(
    parent,
    {
      id,
      data: { title, body, queue, user }
    },
    { db, pubsub }
  ) {
    const comment = db.comments.find(c => c.id === id);

    if (!comment) throw new Error("Comment not found");

    if (typeof title === "string") comment.title = title;
    if (typeof body === "string") comment.body = body;
    if (typeof queue === "string") comment.queue = queue;
    if (typeof user === "string") comment.user = user;

    pubsub.publish(`comment: ${comment.queue}`, {
      comment: { mutation: "UPDATED", data: comment }
    });
    return comment;
  },
  deleteComment(parent, args, { pubsub, db }) {
    const commentIndex = db.comments.findIndex(q => q.id === args.id);

    if (commentIndex === -1) throw new Error("Comment not found");
    const [deletedComment] = db.comments.splice(commentIndex, 1);

    db.queues = db.queues.map(q =>
      q.comments.includes(args.id)
        ? { ...q, comments: q.comments.filter(c => c !== args.id) }
        : q
    );

    db.users = db.users.map(u =>
      u.comments.includes(args.id)
        ? { ...u, comments: u.comments.filter(c => c !== args.id) }
        : u
    );
    pubsub.publish(`comment: ${deletedComment.queue}`, {
      comment: { mutation: "DELETED", data: deletedComment }
    });
    return deletedComment;
  }
};

export default Mutation;
