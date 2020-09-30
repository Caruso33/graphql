import { MyContext } from "./../types"
import { Slip } from "./../entities/Slip"
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql"

@Resolver()
export class SlipResolver {
  // @Query(() => [Slip])
  // slips(@Ctx() { em }: MyContext): Promise<Slip[]> {
  //   return em.find(Slip, {})
  // }

  // @Query(() => Slip, { nullable: true })
  // slip(
  //   @Arg("id", () => Int) id: number,
  //   @Ctx() { em }: MyContext
  // ): Promise<Slip | null> {
  //   return em.findOne(Slip, { id })
  // }

  // @Mutation(() => Slip)
  // async createSlip(
  //   @Arg("title") title: string,
  //   @Ctx() { em }: MyContext
  // ): Promise<Slip> {
  //   const slip = em.create(Slip, { title })
  //   await em.persistAndFlush(slip)
  //   return slip
  // }

  // @Mutation(() => Slip, { nullable: true })
  // async updateSlip(
  //   @Arg("id") id: number,
  //   @Arg("title", () => String, { nullable: true }) title: string | null,
  //   @Ctx() { em }: MyContext
  // ): Promise<Slip | null> {
  //   const slip = await em.findOne(Slip, { id })
  //   if (!slip) {
  //     return null
  //   }

  //   if (typeof title !== "undefined") slip.title = title!

  //   await em.persistAndFlush(slip)

  //   return slip
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
