import { Field, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"
import { Queue } from "./Queue"
import { User } from "./User"

@ObjectType()
@Entity()
export class AdminQueue extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.adminOfQueues, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User

  @Field()
  @PrimaryColumn()
  queueId: number

  @Field(() => Queue)
  @ManyToOne(() => Queue, (queue) => queue.admins, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "queueId" })
  queue: Queue
}
