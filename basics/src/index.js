import { GraphQLServer } from "graphql-yoga";

let COUNTER_OF_IDS = "12";

// scalar types:
//      String, Boolean, Int, Float, ID
const users = [
  { id: "1", name: "Mui", email: "mui@lu.com", age: 11, comments: ["9"] },
  { id: "2", name: "Tobi", email: "tobi@lu.com", age: 12, comments: [] },
  { id: "3", name: "Tui", email: "tui@lu.com", age: 13, comments: ["10", "11"] }
];

const queues = [
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

const comments = [
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
        users(query: String): [User!]!
        queue(query: ID!): [Queue!]!
        comment(query: ID): [Comment!]!
        me: User!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createComment(title: String!, body: String!, queue: ID!, user: ID!): Comment!
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
      return users.filter(u => u.name.toLowerCase().includes(args.query));
    },
    queue(parent, args) {
      return queues.filter(q =>
        q.title.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    comment(p, args) {
      return args.query
        ? comments.filter(c => c.title === args.query)
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
      const { name, email, age } = args;

      const emailTaken = users.some(u => u.email === email);
      if (emailTaken) throw new Error("Email taken.");

      const user = {
        id: COUNTER_OF_IDS++,
        name,
        email,
        age,
        comments: []
      };
      users.push(user);
      return user;
    },
    createComment(parent, args) {
      const { title, body, queue, user } = args;

      const userExists = users.some(u => u.id === user);
      const queueExists = queues.some(q => q.id === queue);

      if (!userExists) throw new Error("User does not exist");
      else if (!queueExists) throw new Error("Queue does not exist");

      const comment = {
        id: COUNTER_OF_IDS,
        title,
        body,
        queue,
        user
      };
      comments.push(comment);

      const userIndex = users.findIndex(u => u.id === user);
      users[userIndex].comments.push(COUNTER_OF_IDS);

      const queueIndex = queues.findIndex(q => q.id === queue);
      queues[queueIndex].comments.push(COUNTER_OF_IDS);

      COUNTER_OF_IDS++;
      return comment;
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
