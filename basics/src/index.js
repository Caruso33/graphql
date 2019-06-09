import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID

// type definitions ( schema )
const typeDefs = `
    type Query {
        hello: String
        name: String!
        age: Int!
        id: ID!
        male: Boolean!
        height: Float!
    }
`;

// resolvers
const resolvers = {
  Query: {
    hello() {
      return null;
    },
    name() {
      return "Tobsn";
    },
    age() {
      return 32;
    },
    id() {
      return "1234-5678-9101-2131";
    },
    male() {
      return true;
    },
    height() {
      return 192.56;
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
