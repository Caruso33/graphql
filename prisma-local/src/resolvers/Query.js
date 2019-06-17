const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query)
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      };
    return prisma.bindings.query.users(opArgs, info);

    // if (!args.query) return db.users;
    // return db.users.filter(u => u.name.toLowerCase().includes(args.name));
  },
  queues(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.bindings.query.queues(opArgs, info);
  },

  slips(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.bindings.query.slips(opArgs, info);
  },

  comments(p, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.bindings.query.comments(opArgs, info);
  },

  me() {
    return {
      id: "123-456",
      name: "Tobsn",
      email: "caruso33@web.de"
    };
  }
};

export default Query;
