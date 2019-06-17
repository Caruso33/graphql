const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma }, info) {
      return prisma.client.$subscribe.comment(null, info);
    }
  },
  queue: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.client.$subscribe.queue(null, info);
    }
  },
  slip: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.client.$subscribe.slip(null, info);
    }
  }
};

export default Subscription;
