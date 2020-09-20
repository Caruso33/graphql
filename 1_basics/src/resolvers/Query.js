const Query = {
  users(parent, args, { db }) {
    if (!args.query) return db.users;
    return db.users.filter(u => u.name.toLowerCase().includes(args.name));
  },
  queue(parent, args, { db }) {
    return db.queues.filter(q =>
      q.title.toLowerCase().includes(args.name.toLowerCase())
    );
  },
  comment(p, args, { db }) {
    return args.title
      ? db.comments.filter(c => c.title === args.title)
      : db.comments;
  },
  me() {
    return {
      id: "123-456",
      name: "Tobsn",
      email: "caruso33@web.de"
    };
  }
};

export default Query;
