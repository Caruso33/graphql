import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Queue from "./resolvers/Queue";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: { Query, User, Comment, Mutation, Queue },
  context: { db }
});

server.start(() => {
  console.log("server is up");
});
