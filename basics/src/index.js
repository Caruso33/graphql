import { GraphQLServer } from "graphql-yoga";

let COUNTER_OF_IDS = "12";

// scalar types:
//      String, Boolean, Int, Float, ID
let users = [
  { id: "1", name: "Mui", email: "mui@lu.com", age: 11, comments: ["9"] },
  { id: "2", name: "Tobi", email: "tobi@lu.com", age: 12, comments: [] },
  { id: "3", name: "Tui", email: "tui@lu.com", age: 13, comments: ["10", "11"] }
];

let queues = [
  {
    id: "4",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 0,
    user: "3",
    comments: []
  },
  {
    id: "5",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 1,
    user: "1",
    comments: ["9"]
  },
  {
    id: "6",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 2,
    user: "2",
    comments: []
  },
  {
    id: "7",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 0,
    user: "2",
    comments: ["10"]
  },
  {
    id: "8",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 1,
    user: "3",
    comments: ["11"]
  }
];

let comments = [
  {
    id: "9",
    title: "Hilarious!",
    body: "Good fast service, highly appreciated",
    queue: "5",
    user: "1"
  },
  {
    id: "10",
    title: "Just Bad!",
    body: "Unfriendly, long waiting",
    queue: "7",
    user: "3"
  },
  {
    id: "11",
    title: "Best hospital in town!",
    body: "Love it every time I go there",
    queue: "8",
    user: "3"
  }
];

// type definitions ( schema )
const typeDefs = ` 
    type Query {
        users(name: String): [User!]!
        queue(name: String!): [Queue!]!
        comment(title: String): [Comment!]!
        me: User!
    }

    type Mutation {
      createUser(data: CreateUserInput): User!
      deleteUser(id: ID!): User!

      createQueue(data: CreateQueueInput): Queue!
      deleteQueue(id: ID!): Queue!

      createComment(data: CreateCommentInput): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreateQueueInput {
      title: String!
      user: ID!
    }
    
    input CreateCommentInput {
      title: String!
      body: String!
      queue: ID! 
      user: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        queues: [Queue!]!
        comments: [Comment]!
    }

    type Queue {
      id: ID!
      title: String!
      processed: Boolean!
      how_many_before: Int!
      user: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      title: String!
      body: String!
      queue: Queue!
      user: User!
    }
`;

// resolvers
const resolvers = {
  Query: {
    users(parent, args) {
      if (!args.query) return users;
      return users.filter(u => u.name.toLowerCase().includes(args.name));
    },
    queue(parent, args) {
      return queues.filter(q =>
        q.title.toLowerCase().includes(args.name.toLowerCase())
      );
    },
    comment(p, args) {
      return args.title
        ? comments.filter(c => c.title === args.title)
        : comments;
    },
    me() {
      return {
        id: "123-456",
        name: "Tobsn",
        email: "caruso33@web.de"
      };
    }
  },
  Mutation: {
    createUser(parent, args, context, info) {
      const { email } = args.data;

      const emailTaken = users.some(u => u.email === email);
      if (emailTaken) throw new Error("Email taken.");

      const user = {
        id: COUNTER_OF_IDS++,
        ...args.data,
        comments: []
      };
      users.push(user);
      return user;
    },
    deleteUser(parent, args, context, info) {
      const userIndex = users.findIndex(u => u.id === args.id);

      if (userIndex === -1) throw new Error("User not found");
      const deletedUser = users.splice(userIndex, 1);

      queues = queues.filter(q => {
        const match = q.user === args.id;
        if (match) comments = comments.filter(c => c.queue !== q.id);
        return !match;
      });
      comments = comments.filter(c => c.user !== args.id);

      return deletedUser[0];
    },

    createQueue(parent, args) {
      const queue = {
        id: COUNTER_OF_IDS++,
        ...args.data,
        processed: false,
        how_many_before: 0,
        comments: []
      };

      queues.push(queue);
      return queue;
    },
    deleteQueue(parent, args) {
      const queueIndex = queues.findIndex(q => q.id === args.id);

      if (queueIndex === -1) throw new Error("Queue not found");
      const deletedQueue = queues.splice(queueIndex, 1);

      comments = comments.filter(c => c.queue === args.id);

      return deletedQueue[0];
    },

    createComment(parent, args) {
      const { queue, user } = args.data;

      const userExists = users.some(u => u.id === user);
      const queueExists = queues.some(q => q.id === queue);

      if (!userExists) throw new Error("User does not exist");
      else if (!queueExists) throw new Error("Queue does not exist");

      const comment = {
        id: COUNTER_OF_IDS,
        ...args.data
      };
      comments.push(comment);

      const userIndex = users.findIndex(u => u.id === user);
      users[userIndex].comments.push(COUNTER_OF_IDS);

      const queueIndex = queues.findIndex(q => q.id === queue);
      queues[queueIndex].comments.push(COUNTER_OF_IDS);

      COUNTER_OF_IDS++;
      return comment;
    },
    deleteComment(parent, args) {
      const commentIndex = comments.findIndex(q => q.id === args.id);

      if (commentIndex === -1) throw new Error("Comment not found");
      const deletedComment = comments.splice(commentIndex, 1);

      queues = queues.map(q =>
        q.comments.includes(args.id)
          ? { ...q, comments: q.comments.filter(c => c !== args.id) }
          : q
      );

      users = users.map(u =>
        u.comments.includes(args.id)
          ? { ...u, comments: u.comments.filter(c => c !== args.id) }
          : u
      );

      return deletedComment[0];
    }
  },

  Queue: {
    user(parent, args, ctx, info) {
      return users.find(u => u.id === parent.user);
    },
    comments(parent) {
      return comments.filter(c => parent.comments.includes(c.id));
    }
  },

  User: {
    queues(parent, args, ctx, info) {
      return queues.filter(q => q.user === parent.id);
    },
    comments(parent) {
      return comments.filter(c => parent.comments.includes(c.id));
    }
  },

  Comment: {
    queue(parent) {
      return queues.find(q => q.id === parent.queue);
    },
    user(parent) {
      return users.find(u => u.id === parent.user);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("server is up");
});
