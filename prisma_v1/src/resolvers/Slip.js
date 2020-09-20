import getUserId from "../utils/getUserId"

const Slip = {
  position: {
    fragment: "fragment slipId on Slip { id queue { id }}",
    async resolve(parent, { id }, { prisma, request }, info) {
      getUserId(request)

      const queue = await prisma.bindings.query.queue(
        {
          where: { id: parent.queue.id }
        },
        " { slips { id } } "
      )

      const index = queue.slips.findIndex(slip => slip.id === parent.id)
      return index
    }
  }
}

export default Slip
