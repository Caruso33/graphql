import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import prisma from "./prisma";

console.log("prisma", prisma);
const server = new GraphQLServer({
  typeDefs: "./src/db/schema.graphql",
  resolvers,
  context: ({ req }) => ({
    request: req,
    prisma
  }),
  playground: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development"
});

server.start(({ port }) => {
  console.log("nodejs graphql server is up on port", port);
});
