const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma }, info) {
      return prisma.bindings.subscription.comment(
        {
          where: {
            node: { queue: { id: queueId } }
          }
        },
        info
      );
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
