import { Queue } from "./entities/Queue"
import { __prod__ } from "./utils/constants"
import { MikroORM } from "@mikro-orm/core"
import microTask from "./mikro-orm.config"

const main = async () => {
  const orm = await MikroORM.init(microTask)
  await orm.getMigrator().up()

  const queue = orm.em.create(Queue, { title: "My first queue" })
  await orm.em.persistAndFlush(queue)

  await orm.em.nativeInsert(Queue, {
    title: "my second queue",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const queues = await orm.em.find(Queue, {})
  console.dir(queues)
}

main()
