import argon2 from "argon2"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql"
import { MyContext } from "../types"
import { User } from "./../entities/User"

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string

  @Field()
  password!: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  // @Query(() => [User])
  // users(@Ctx() { em }: MyContext): Promise<User[]> {
  //   return em.find(User, {})
  // }

  // @Query(() => User, { nullable: true })
  // user(
  //   @Arg("id", () => Int) id: number,
  //   @Ctx() { em }: MyContext
  // ): Promise<User | null> {
  //   return em.findOne(User, { id })
  // }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options")
    { username, password }: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "length must be greater than 2" },
        ],
      }
    }

    if (password.length <= 2) {
      return {
        errors: [
          { field: "password", message: "length must be greater than 2" },
        ],
      }
    }

    const hashedPassword = await argon2.hash(password)
    const user = em.create(User, {
      username: username,
      password: hashedPassword,
    })

    try {
      await em.persistAndFlush(user)
    } catch {
      return {
        errors: [{ field: "username", message: "username already exists" }],
      }
    }

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options")
    { username, password }: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: username.toLowerCase() })

    if (!user) {
      return {
        errors: [{ field: "username", message: "that username doesn't exist" }],
      }
    }

    const isValid = await argon2.verify(user.password, password)

    if (!isValid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      }
    }

    return { user }
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //   @Arg("id") id: number,
  //   @Arg("title", () => String, { nullable: true }) title: string | null,
  //   @Ctx() { em }: MyContext
  // ): Promise<User | null> {
  //   const user = await em.findOne(User, { id })
  //   if (!user) {
  //     return null
  //   }

  //   if (typeof title !== "undefined") user.title = title!

  //   await em.persistAndFlush(user)

  //   return user
  // }

  // @Mutation(() => Boolean)
  // async deleteQueue(
  //   @Arg("id") id: number,
  //   @Ctx() { em }: MyContext
  // ): Promise<boolean> {
  //   try {
  //     await em.nativeDelete(User, { id })
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
