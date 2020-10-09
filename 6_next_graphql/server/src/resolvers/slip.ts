import { isAuth } from "./../middleware/isAuth"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { Queue } from "./../entities/Queue"
import { Slip } from "./../entities/Slip"
import { MyContext } from "./../types"

@InputType()
class SlipInput {
  @Field()
  title!: string
  @Field()
  queue!: Queue
}

@Resolver()
export class SlipResolver {
  @Query(() => [Slip])
  slips(@Ctx() {}: MyContext): Promise<Slip[]> {
    return Slip.find({})
  }

  @Query(() => Slip, { nullable: true })
  slip(
    @Arg("id", () => Int) id: number,
    @Ctx() {}: MyContext
  ): Promise<Slip | undefined> {
    return Slip.findOne(id)
  }

  @Mutation(() => Slip)
  @UseMiddleware(isAuth)
  async createSlip(
    @Arg("options") options: SlipInput,
    @Ctx() { req }: MyContext
  ): Promise<Slip | undefined> {
    if (!req.session?.userId) {
    }
    return Slip.create({ ...options, userId: req.session!.userId }).save()
  }

  @Mutation(() => Boolean)
  async deleteSlip(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Slip, { id })
      return true
    } catch {
      return false
    }
  }
}
