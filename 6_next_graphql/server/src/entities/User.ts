import { Field, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Queue } from "./Queue"
import { Slip } from "./Slip"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  email!: string

  @Field()
  @Column({ unique: true })
  username!: string

  @Column()
  password!: string

  @Field(() => [Queue], { nullable: true })
  @ManyToMany(() => Queue, (queue) => queue.admins)
  adminOfQueues!: Queue[]

  @Field(() => [Slip], { nullable: true })
  @OneToMany(() => Slip, (slip) => slip.user, { cascade: true })
  slips!: Slip[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
