import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, Int, ObjectType } from "type-graphql"
import { Slip } from "./Slip"

@ObjectType()
@Entity()
export class Queue {
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
  @Property({ type: "text" })
  title!: string

  @Field(() => [Slip])
  @OneToMany(() => Slip, (slip) => slip.queue)
  slips!: Slip[]
}
