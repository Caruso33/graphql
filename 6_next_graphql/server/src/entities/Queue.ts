import { Field, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { AdminQueue } from "./AdminQueue"
import { Slip } from "./Slip"

@ObjectType()
@Entity()
export class Queue extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column({ default: "" })
  description: string

  @OneToMany(() => AdminQueue, (adminQueue) => adminQueue.queue, {
    onDelete: "CASCADE",
  })
  admins!: AdminQueue[]

  // TODO: Location field
  @Field(() => [Slip], { nullable: true })
  @OneToMany(() => Slip, (slip) => slip.queue)
  slips!: Slip[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}

export enum QueueSubscription {
  queue_update,
}
