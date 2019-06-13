const Queue = {
  user(parent, args, { db }, info) {
    return db.users.find(u => u.id === parent.user);
  },
  comments(parent, args, { db }) {
    return db.comments.filter(c => parent.comments.includes(c.id));
  }
};

export default Queue;
