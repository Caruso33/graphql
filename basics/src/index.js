import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID
const users = [
  { id: "1", name: "Mui", email: "mui@lu.com", age: 11 },
  { id: "2", name: "Tobi", email: "tobi@lu.com", age: 12 },
  { id: "3", name: "Tui", email: "tui@lu.com", age: 13 }
];

const queues = [
  {
    id: "1",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 0,
    user: "3"
  },
  {
    id: "2",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 1,
    user: "1"
  },
  {
    id: "3",
    title: "Hospital Medication",
    processed: false,
    how_many_before: 2,
    user: "2"
  },
  {
    id: "4",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 0,
    user: "2"
  },
  {
    id: "5",
    title: "Hospital Doctor Appointment",
    processed: false,
    how_many_before: 1,
    user: "3"
  }
];

// type definitions ( schema )
const typeDefs = ` 
    type Query {
        users(query: String): [User!]!
        queue(query: ID!): [Queue!]!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        queues: [Queue!]!
    }

    type Queue {
      id: ID!
      title: String!
      processed: Boolean!
      how_many_before: Int!
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
      return queues.filter(q => q.id === args.query);
    },
    me() {
      return {
        id: "123-456",
        name: "Tobsn",
        email: "caruso33@web.de"
      };
    }
  },
  Queue: {
    user(parent, args, ctx, info) {
      return users.find(u => u.id === parent.user);
    }
  },
  User: {
    queues(parent, args, ctx, info) {
      return queues.filter(q => q.user === parent.id);
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
