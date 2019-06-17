import { fragmentReplacements } from "./resolvers";

const Bindings = require("prisma-binding");
const Client = require("./schema/generated/prisma-client");

module.exports = {
  client: new Client.Prisma({
    fragmentReplacements,
    endpoint: "http://localhost:4466",
    // secret: process.env.PRISMA_SECRET,
    debug: false
  }),
  bindings: new Bindings.Prisma({
    typeDefs: "src/schema/generated/prisma.graphql",
    fragmentReplacements,
    endpoint: "http://localhost:4466",
    // secret: process.env.PRISMA_SECRET,
    debug: false
  })
};
