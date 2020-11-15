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

  @Field(() => Boolean)
  @Column({ default: false })
  isSuperAdmin: boolean

  @OneToMany(() => AdminQueue, (adminQueue) => adminQueue.user, {
    onDelete: "CASCADE",
  })
  adminOfQueues!: AdminQueue[]

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
