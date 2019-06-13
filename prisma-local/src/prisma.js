import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "./generated/prisma-client/prisma-schema.js",
  endpoint: "localhost:4466"
});

