import { validateRegister } from "./../validations/register"
import { cookieName } from "./../utils/constants"
import argon2 from "argon2"
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { MyContext } from "../types"
import { User } from "./../entities/User"
import { UsernamePasswordInput, FieldError, UserResponse } from "../types/user"
import { validate } from "graphql"

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {})
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id })
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { em, req }: MyContext): Promise<User | null> | null {
    if (!req.session?.userId) {
      return null
    }

    return em.findOne(User, { id: req.session.userId })
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options")
    options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) return { errors }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
      email: options.email,
    })

    try {
      await em.persistAndFlush(user)
    } catch {
      return {
        errors: [{ field: "username", message: "username already exists" }],
      }
    }

    req.session!.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail.toLowerCase() }
        : { username: usernameOrEmail.toLowerCase() }
    )

    if (!user) {
      return {
        errors: [
          { field: "usernameOrEmail", message: "that username doesn't exist" },
        ],
      }
    }

    const isValid = await argon2.verify(user.password, password)

    if (!isValid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      }
    }

    req.session!.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session!.destroy((err) => {
        if (!err) res.clearCookie(cookieName)
        else console.error(err)

        resolve(!err)
      })
    )
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx()
    { req, em }: MyContext
  ) {
    const user = await em.findOne(User, { email })

    return true
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
