import Bindings from "prisma-binding";
import Client from "./schema/generated/prisma-client";
import { fragmentReplacements } from "./resolvers";

console.log('Bindings', Bindings, Client)
module.exports = {
  client: new Client.Prisma({
    fragmentReplacements,
    endpoint: process.env.PRISMA_ENDPOINT,
    // secret: process.env.PRISMA_SECRET,
    debug: false
  }),
  bindings: new Bindings.Prisma({
    typeDefs: "src/schema/generated/prisma.graphql",
    fragmentReplacements,
    endpoint: process.env.PRISMA_ENDPOINT,
    // secret: process.env.PRISMA_SECRET,
    debug: false
  })
};
