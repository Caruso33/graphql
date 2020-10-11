import argon2 from "argon2"
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql"
import { v4 } from "uuid"
import { MyContext } from "../types"
import { UsernamePasswordInput, UserResponse } from "../types/user"
import { sendEmail } from "../utils/sendEmail"
import {
  getValidationErrors,
  UserValidationError,
  validateChangeForgotPassword,
  validateRegister,
} from "../validations/user"
import { User } from "./../entities/User"
import {
  cookieName,
  forgetPasswordPrefix,
  frontendDomain,
} from "./../utils/constants"
// import { getConnection } from "typeorm"

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({ relations: ["adminOfQueues"] })
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    return User.findOne(id, { relations: ["adminOfQueues"] })
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext): Promise<User | undefined> | null {
    if (!req.session?.userId) {
      return null
    }

    return User.findOne({ where: { id: req.session.userId } })
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options")
    options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors.length) return { errors }

    const hashedPassword = await argon2.hash(options.password)
    try {
      const user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email,
      }).save()

      // const result = await getConnection()
      //   .createQueryBuilder()
      //   .insert()
      //   .into(User)
      //   .values({
      //     username: options.username,
      //     password: hashedPassword,
      //     email: options.email,
      //   })
      //   .returning("*")
      //   .execute()

      req.session!.userId = user.id

      return { user }
    } catch {
      return {
        errors: [{ field: "username", message: "username already exists" }],
      }
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail.toLowerCase() }
        : { username: usernameOrEmail.toLowerCase() },
    })

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
    { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } })
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
    { redis, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateChangeForgotPassword(newPassword)
    if (errors.length) return { errors }

    const redisKey = forgetPasswordPrefix + token
    const userId = await redis.get(redisKey)
    if (!userId) {
      return {
        errors: getValidationErrors([UserValidationError.token__expired]),
      }
    }

    const userIdInt = parseInt(userId)
    const user = await User.findOne(userIdInt)
    if (!user) {
      return {
        errors: getValidationErrors([
          UserValidationError.token__userNoLongerExist,
        ]),
      }
    }

    const hashedPassword = await argon2.hash(newPassword)
    await User.update({ id: userIdInt }, { password: hashedPassword })

    await redis.del(redisKey)

    req.session!.userId = user.id

    return { user }
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //   @Arg("id") id: number,
  //   @Arg("title", () => String, { nullable: true }) title: string | null
  // ): Promise<User | null> {
  //   const user = await User.findOne(id)
  //   if (!user) {
  //     return null
  //   }

  //   if (typeof title !== "undefined")

  //   await User.update...

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
