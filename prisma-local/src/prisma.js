import { Prisma } from './generated/prisma-client'

const prisma = new Prisma({
  endpoint: "http://localhost:4466"
});

prisma.users(null, "{ id name email }").then(data => {
  console.log(data);
});
