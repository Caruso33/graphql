import prisma from "./prisma"
import { GraphQLServer } from "graphql-yoga"
import { resolvers } from "./resolvers"

const server = new GraphQLServer({
  typeDefs: "./src/schema/schema.graphql",
  resolvers,
  context: ({ req }) => ({
    request: req,
    prisma
  }),
  playground: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development"
})

server.start(({ port }) => {
  console.log("nodejs graphql server is up on port", port)
})
