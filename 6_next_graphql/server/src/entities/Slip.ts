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

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column()
  processed!: boolean

  @Field()
  @ManyToOne(() => Slip, (slip) => slip.user)
  user!: User

  @Field(() => Queue)
  @ManyToOne(() => Slip, (slip) => slip.queue)
  queue!: Queue
}
