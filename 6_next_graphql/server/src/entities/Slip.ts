import { Field, Int, ObjectType } from "type-graphql"
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
  @Column({ type: "int" })
  initialQueueSize: number

  @Field()
  @Column()
  userId!: number

  @ManyToOne(() => User, (user) => user.slips)
  user!: User

  @Field(() => Queue)
  @ManyToOne(() => Queue, (queue) => queue.slips)
  queue!: Queue

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
