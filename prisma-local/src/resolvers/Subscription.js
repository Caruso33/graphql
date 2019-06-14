const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma, pubsub }, info) {
      const queue = prisma.queues.find(q => q.id === queueId);

      if (!queue) throw new Error("Queue not found");

      return pubsub.asyncIterator(`comment: ${queueId}`);
    }
  },
  queue: {
    subscribe(parent, {}, { pubsub }) {
      return pubsub.asyncIterator("queue");
    }
  },
  slip: {
    subscribe(parent, {}, { pubsub }) {
      return pubsub.asyncIterator("slip");
    }
  }
};

export default Subscription;
