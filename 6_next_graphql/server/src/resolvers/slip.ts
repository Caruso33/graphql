import { Arg, Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql"
import { getConnection } from "typeorm"
import { Slip } from "./../entities/Slip"
import { MyContext } from "../types/types"

@ObjectType()
class PaginatedSlips {
  @Field(() => [Slip])
  slips!: Slip[]
  @Field()
  hasMore!: boolean
}

@Resolver()
export class SlipResolver {
  @Query(() => PaginatedSlips)
  async slips(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedSlips> {
    const realLimit = Math.min(50, limit)
    const realLimitHasMore = realLimit + 1 // to check if hasMore

    const qb = getConnection()
      .getRepository(Slip)
      .createQueryBuilder("s") // alias
      .where("s.active = true")
      .leftJoinAndSelect("s.queue", "q")
      .leftJoinAndSelect("s.user", "u")
      .orderBy("s.createdAt", "DESC")
      .take(realLimitHasMore)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    const slips = await qb.getMany()

    return {
      slips: slips.slice(0, realLimit),
      hasMore: slips.length === realLimitHasMore,
    }
  }

  @Query(() => Slip, { nullable: true })
  slip(
    @Arg("id", () => Int) id: number,
    @Ctx() {}: MyContext
  ): Promise<Slip | undefined> {
    return Slip.findOne(id, { relations: ["user", "queue"] })
  }

  // @Mutation(() => Slip)
  // @UseMiddleware(isAuth)
  // async createSlip(
  //   @Arg("options") options: SlipInput,
  //   @Ctx() { req }: MyContext
  // ): Promise<Slip | undefined> {
  //   if (!req.session?.userId) {
  //   }
  //   return Slip.create({ ...options, userId: req.session!.userId }).save()
  // }

  // @Mutation(() => Boolean)
  // async deleteSlip(
  //   @Arg("id") id: number,
  //   @Ctx() { em }: MyContext
  // ): Promise<boolean> {
  //   try {
  //     await em.nativeDelete(Slip, { id })
  //     return true
  //   } catch {
  //     return false
  //   }
  // }
}
