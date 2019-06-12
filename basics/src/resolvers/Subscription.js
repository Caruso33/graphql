const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count
        });
      }, 1000);

      return pubsub.asyncIterator("count");
    }
  },
  comment: {
    subscribe(parent, { queueId }, { db, pubsub }, info) {
      const queue = db.queues.find(q => q.id === queueId);

      if (!queue) throw new Error("Queue not found");

      return pubsub.asyncIterator(`comment: ${queueId}`);
    }
  },
  queue: {
    subscribe(parent, {}, { pubsub }) {
      return pubsub.asyncIterator("queue");
    }
  }
};

export default Subscription;
