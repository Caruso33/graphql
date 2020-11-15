import argon2 from "argon2"
import { Queue } from "../entities/Queue"
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { v4 } from "uuid"
import { AdminQueue } from "../entities/AdminQueue"
import { User } from "../entities/User"
import { MyContext } from "../types/types"
import { UsernamePasswordInput, UserResponse } from "../types/user"
import { sendEmail } from "../utils/sendEmail"
import {
  getValidationErrors,
  UserValidationError,
  validateChangeForgotPassword,
  validateRegister,
} from "../validations/user"
import { isAdminOfQueue, isAuth } from "./../middleware/authentication"
import {
  cookieName,
  forgetPasswordPrefix,
  frontendDomain,
} from "./../utils/constants"

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => [Queue])
  async adminOfQueues(
    @Root() user: User,
    @Ctx() { queueFromQueueAdminLoader }: MyContext
  ) {
    return queueFromQueueAdminLoader.load(user.id)
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({ relations: ["adminOfQueues", "slips", "slips.queue"] })
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    return User.findOne(id, {
      relations: ["adminOfQueues", "slips", "slips.queue"],
    })
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext): Promise<User | undefined> | null {
    if (!req.session?.userId) {
      return null
    }

    return User.findOne({
      where: { id: req.session.userId },
      relations: ["adminOfQueues"],
    })
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
        adminOfQueues: [],
        slips: [],
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
    req.session!.isSuperAdmin = user.isSuperAdmin

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
    const link = `<a href="${process.env.FRONTEND_DOMAIN}/change-password/${token}">Reset Password</a>`

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

  @UseMiddleware(isAuth, isAdminOfQueue)
  @Mutation(() => AdminQueue, { nullable: true })
  async addAdmin(
    @Arg("queueId") queueId: number,
    @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ): Promise<AdminQueue | null> {
    const adminQueue = await AdminQueue.create({ userId, queueId }).save()

    req!.session!.adminOfQueues = req!.session!.adminOfQueues
      ? [...req!.session!.adminOfQueues, queueId]
      : [queueId]

    return adminQueue
  }

  @UseMiddleware(isAuth, isAdminOfQueue)
  @Mutation(() => AdminQueue, { nullable: true })
  async removeAdmin(
    @Arg("queueId") queueId: number,
    @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ): Promise<AdminQueue | null> {
    const adminQueue = await AdminQueue.findOne({
      where: { queueId, userId },
    })

    if (!adminQueue) {
      return null
    }

    req!.session!.adminOfQueues = req!.session!.adminOfQueues
      ? req!.session!.adminOfQueues.filter(
          (contextQueueId: number) => contextQueueId !== queueId
        )
      : []

    AdminQueue.remove(adminQueue)

    return adminQueue
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
