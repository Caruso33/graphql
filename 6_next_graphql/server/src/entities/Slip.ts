import { Field, Int, ObjectType, Root } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Queue } from "./Queue"
import { User } from "./User"

@ObjectType()
@Entity()
export class Slip extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ default: false })
  processed!: boolean

  @Field()
  @Column({ default: true })
  active!: boolean

  @Field()
  @Column({ type: "int" })
  initialQueueSize: number

  @Field(() => Int, { nullable: true })
  async queuePosition(@Root() slip: Slip) {
    if (!slip.queue) return null

    const queue = await Queue.findOne(slip.queue?.id, { relations: ["slips"] })
    const slipIds = (queue?.slips || []).map((slip) => slip.id)
    const index = slipIds.indexOf(slip.id)

    return index
  }

  @Field()
  @Column()
  userId!: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.slips)
  user!: User

  @Field(() => Queue, { nullable: true })
  @ManyToOne(() => Queue, (queue) => queue.slips, { onDelete: "CASCADE" })
  queue: Queue

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
