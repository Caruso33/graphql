const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma }, info) {
      return prisma.$subscribe.comment(null, info);
    }
  },
  queue: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.$subscribe.queue(null, info);
    }
  },
  slip: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.$subscribe.slip(null, info);
    }
  }
};

export default Subscription;
