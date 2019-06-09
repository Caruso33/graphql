import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID

// type definitions ( schema )
const typeDefs = `
    type Query {
        greeting(name: String): String!
        grades: [Int!]!
        add(numbers: [Float!]!): Float!
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
      return args.name ? `Hi ${args.name}!` : "Hello!";
    },
    grades() {
      return [1, 2, 5, 6, 7, 1];
    },
    add(_, args) {
      return args.numbers.length === 0
        ? 0
        : args.numbers.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          });
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
