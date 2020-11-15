import { In } from "typeorm"
import DataLoader from "dataloader"
import { Slip } from "../entities/Slip"

// [queueId]
// => [{Slip}]

export const createSlipFromQueueLoader = () =>
  new DataLoader<number, Slip[] | null>(async (queueIds) => {
    const slips = await Slip.find({
      where: { queue: In(queueIds as number[]) },
      relations: ["queue"],
    })

    const slipIdToSlip: Record<number, Slip[]> = {}
    slips.forEach((slip: Slip) => {
      const slipsQueueId = slip.queue.id

      slipIdToSlip[slipsQueueId] = slipIdToSlip[slipsQueueId]
        ? [...slipIdToSlip[slipsQueueId], slip]
        : [slip]
    })

    return queueIds.map((queueId) => slipIdToSlip[queueId])
  })
