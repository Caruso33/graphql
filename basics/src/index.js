import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID

// type definitions ( schema )
const typeDefs = `
    type Query {
        greeting(name: String): String!
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
    greeting(parent, args, ctx, info) {
      console.log(args);
      return args.name ? `Hi ${args.name}!` : "Hello!";
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
