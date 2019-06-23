import getUserId from "../utils/getUserId"

const Slip = {
  how_many_before: {
    fragment: "fragment slipId on Slip { id }",
    async resolve(parent, { id }, { prisma, request }, info) {
      const userId = getUserId(request)

      // const queue = await prisma.bindings.query.queues(
      //   {
      //     where: {
      //       slips: { slips_some: { id: parent.queue } }
      //     }
      //   },
      //   info
      // )

      // const index = queue.slips.indexOf(id) + 1
      // console.log("index", queue)
      return 0
    }
  }
}

export default Slip
