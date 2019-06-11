const Comment = {
  queue(parent, args, { db }) {
    return db.queues.find(q => q.id === parent.queue);
  },
  user(parent, args, { db }) {
    return db.users.find(u => u.id === parent.user);
  }
};

export default Comment;
