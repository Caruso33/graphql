import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID
const users = [
  {
    id: "la",
    name: "lu",
    email: "la@lu.com",
    age: 1
  },
  { id: "la", name: "lu", email: "la@lu.com", age: 1 },
  { id: "la", name: "lu", email: "la@lu.com", age: 1 }
];

// type definitions ( schema )
const typeDefs = ` 
    type Query {
        users(query: String): [User!]!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`;

// resolvers
const resolvers = {
  Query: {
    users(parent, args) {
      if (!args.query) return users;

      return users.filter(u => u.name.toLowerCase().includes(args.query));
    },
    me() {
      return {
        id: "123-456",
        name: "Tobsn",
        email: "caruso33@web.de"
      };
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
