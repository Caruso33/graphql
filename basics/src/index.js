import { GraphQLServer } from "graphql-yoga";

// type definitions ( schema )
const typeDefs = `
    type Query {
        hello: String!,
        name: String!
    }
`;

// resolvers
const resolvers = {
  Query: {
    hello() {
      return "This is GraphQL";
    },
    name() {
      return "Tobsn";
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
