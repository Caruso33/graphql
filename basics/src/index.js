import { GraphQLServer } from "graphql-yoga";

// scalar types:
//      String, Boolean, Int, Float, ID

// type definitions ( schema )
const typeDefs = `
    type Query {
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
    me() {
        return {
            id: '123-456',
            name: 'Tobsn',
            email: 'caruso33@web.de'
        }
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
