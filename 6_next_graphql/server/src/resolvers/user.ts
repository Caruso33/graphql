import argon2 from "argon2"
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql"
import { MyContext } from "../types"
import { FieldError, UsernamePasswordInput, UserResponse } from "../types/user"
import { sendEmail } from "../utils/sendEmail"
import { User } from "./../entities/User"
import {
  cookieName,
  forgetPasswordPrefix,
  frontendDomain,
} from "./../utils/constants"
import {
  getValidationErrors,
  validateChangeForgotPassword,
  validateRegister,
  UserValidationError,
} from "../validations/user"
import { v4 } from "uuid"

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
    if (errors.length) return { errors }

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
        errors: getValidationErrors([
          UserValidationError.usernameOrEmail__notExist,
        ]),
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
    { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email })
    if (!user) {
      return false
    }

    const token = v4()
    redis.set(forgetPasswordPrefix + token, user.id, "ex", 1000 * 60 * 60)
    const link = `<a href="${frontendDomain}/change-password/${token}">Reset Password</a>`

    const html = `Hi,<br/><br/>please change your password within 1 hour by following <br/>${link}<br/><br/>Cheers`

    await sendEmail(email, html)

    return true
  }

  @Mutation(() => UserResponse)
  async changeForgotPassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx()
    { em, redis, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateChangeForgotPassword(newPassword)
    if (errors.length) return { errors }

    const userId = await redis.get(forgetPasswordPrefix + token)
    if (!userId) {
      return {
        errors: getValidationErrors([UserValidationError.token__expired]),
      }
    }

    const user = await em.findOne(User, { id: parseInt(userId) })
    if (!user) {
      return {
        errors: getValidationErrors([
          UserValidationError.token__userNoLongerExist,
        ]),
      }
    }

    const hashedPassword = await argon2.hash(newPassword)
    user.password = hashedPassword

    await em.persistAndFlush(user)
    redis.del(forgetPasswordPrefix + token)

    req.session!.userId = user.id

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
