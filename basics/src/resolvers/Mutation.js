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

  createQueue(parent, args, { db }) {
    const queue = {
      id: db.COUNTER_OF_IDS++,
      ...args.data,
      processed: false,
      how_many_before: 0,
      comments: []
    };

    db.queues.push(queue);
    return queue;
  },
  deleteQueue(parent, args, { db }) {
    const queueIndex = db.queues.findIndex(q => q.id === args.id);

    if (queueIndex === -1) throw new Error("Queue not found");
    const deletedQueue = db.queues.splice(queueIndex, 1);

    db.comments = db.comments.filter(c => c.queue === args.id);

    return deletedQueue[0];
  },

  createComment(parent, args, { db }) {
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

    const userIndex = db.users.findIndex(u => u.id === user);
    db.users[userIndex].comments.push(db.COUNTER_OF_IDS);

    const queueIndex = db.queues.findIndex(q => q.id === queue);
    db.queues[queueIndex].comments.push(db.COUNTER_OF_IDS);

    db.COUNTER_OF_IDS++;
    return comment;
  },
  deleteComment(parent, args, { db }) {
    const commentIndex = db.comments.findIndex(q => q.id === args.id);

    if (commentIndex === -1) throw new Error("Comment not found");
    const deletedComment = db.comments.splice(commentIndex, 1);

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

    return deletedComment[0];
  }
};

export default Mutation;
