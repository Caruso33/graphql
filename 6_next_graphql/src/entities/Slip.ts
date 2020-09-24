import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, Int, ObjectType } from "type-graphql"
import { Queue } from "./Queue"
import { User } from "./User"

@ObjectType()
@Entity()
export class Slip {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date()

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date()

  @Field()
  @Property({ type: "bool" })
  processed!: boolean

  @Field()
  @ManyToOne()
  user!: User

  @Field(() => Queue)
  @ManyToOne(() => Queue)
  queue!: Queue
}
