const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query)
      opArgs.where = {
        OR: [{ name_contain: args.query }, { email_contain: args.query }]
      };
    return prisma.users(opArgs, info);

    // if (!args.query) return db.users;
    // return db.users.filter(u => u.name.toLowerCase().includes(args.name));
  },
  queues(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.queues(opArgs, info);
  },

  slips(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.slips(opArgs, info);
  },

  comments(p, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) opArgs.where = { title_contains: args.query };

    return prisma.comments(opArgs, info);
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
