const Mutation = {
  createUser(parent, args, { db }, info) {
    const { email } = args.data;

    const emailTaken = db.users.some(u => u.email === email);
    if (emailTaken) throw new Error("Email taken.");

    const user = {
      id: db.COUNTER_OF_IDS++,
      ...args.data,
      comments: []
    };
    db.users.push(user);
    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(u => u.id === id);

    if (!user) throw Error("User not found");

    if (typeof data.email === "string") {
      const emailTaken = db.users.some(u => u.email === data.email);

      if (emailTaken) throw Error("Email taken");

      user.email = data.email;
    }

    if (typeof data.name === "string") user.name = data.name;

    // can be null for resetting
    if (typeof data.age !== "undefined") user.age = data.age;

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(u => u.id === args.id);

    if (userIndex === -1) throw new Error("User not found");
    const deletedUser = db.users.splice(userIndex, 1);

    db.queues = db.queues.filter(q => {
      const match = q.user === args.id;
      if (match) db.comments = db.comments.filter(c => c.queue !== q.id);
      return !match;
    });
    db.comments = db.comments.filter(c => c.user !== args.id);

    return deletedUser[0];
  },

  createQueue(parent, args, { db, pubsub }) {
    const queue = {
      id: db.COUNTER_OF_IDS++,
      ...args.data,
      processed: false,
      position: 0,
      comments: []
    };

    db.queues.push(queue);
    pubsub.publish("queue", { queue: { mutation: "CREATED", data: queue } });
    return queue;
  },
  updateQueue(
    parent,
    {
      id,
      data: { title, user, processed, position, comments }
    },
    { db, pubsub }
  ) {
    const queue = db.queues.find(q => q.id === id);

    if (!queue) throw new Error("Queue not found");

    if (typeof title === "string") queue.title = title;
    if (typeof user === "string") queue.user = user;
    if (typeof processed === "boolean") queue.processed = processed;
    if (typeof position === "number")
      queue.position = position;
    if (typeof comments === "string") queue.comments.push(comments);

    pubsub.publish("queue", { queue: { mutation: "UPDATED", data: queue } });
    return queue;
  },
  deleteQueue(parent, args, { db, pubsub }) {
    const queueIndex = db.queues.findIndex(q => q.id === args.id);

    if (queueIndex === -1) throw new Error("Queue not found");
    const [deletedQueue] = db.queues.splice(queueIndex, 1);

    db.comments = db.comments.filter(c => c.queue === args.id);
    pubsub.publish("queue", {
      queue: { mutation: "DELETED", data: deletedQueue }
    });
    return deletedQueue;
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
