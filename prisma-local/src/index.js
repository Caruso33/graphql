import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Queue from "./resolvers/Queue";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import { prisma } from './generated/prisma-client'

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: { Query, User, Comment, Subscription, Mutation, Queue },
  context: { db, pubsub, prisma }
});

server.start(() => {
  console.log("server is up");

console.log(prisma.mutation)
});

// prisma.users(null, "{ id name email }").then(data => {
//   console.log(data);
// });
