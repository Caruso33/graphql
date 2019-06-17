const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma }, info) {
      return prisma.bindings.subscription.comment(null, info);
    }
  },
  queue: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.bindings.subscription.queue(null, info);
    }
  },
  slip: {
    subscribe(parent, {}, { prisma }, info) {
      return prisma.bindings.subscription.slip(null, info);
    }
  }
};

export default Subscription;
