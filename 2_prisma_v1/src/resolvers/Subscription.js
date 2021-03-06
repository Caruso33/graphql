import getUserId from "../utils/getUserId"

const Subscription = {
  comment: {
    subscribe(parent, { queueId }, { prisma }, info) {
      return prisma.bindings.subscription.comment(
        {
          where: {
            node: { queue: { id: queueId } }
          }
        },
        info
      )
    }
  },

  queue: {
    subscribe(parent, { id }, { prisma, request }, info) {
      getUserId(request)

      return prisma.bindings.subscription.queue(
        { where: { node: { id } } },
        info
      )
    }
  },

  slip: {
    subscribe(parent, { queueId }, { prisma, request }, info) {
      getUserId(request)

      return prisma.bindings.subscription.slip(
        { where: { node: { queue: { id: queueId } } } },
        info
      )
    }
  }
}

export default Subscription
