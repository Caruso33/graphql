import { extractFragmentReplacements } from "prisma-binding";
import Comment from "./Comment";
import Mutation from "./Mutation";
import Query from "./Query";
import Queue from "./Queue";
import Subscription from "./Subscription";
import User from "./User";

const resolvers = {
  Query,
  User,
  Comment,
  Subscription,
  Mutation,
  Queue
};

module.exports = {
  resolvers,
  fragmentReplacements: extractFragmentReplacements(resolvers)
};
