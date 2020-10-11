import { Field, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Slip } from "./Slip"
import { User } from "./User"

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

  @Field(() => [User])
  @ManyToMany(() => User, user => user.adminOfQueues)
  @JoinTable()
  admins!: User[]

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
