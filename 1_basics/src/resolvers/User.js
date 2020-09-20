const User = {
  queues(parent, args, { db }, info) {
    return db.queues.filter(q => q.user === parent.id);
  },
  comments(parent, args, { db }) {
    return db.comments.filter(c => parent.comments.includes(c.id));
  }
};

export default User;
