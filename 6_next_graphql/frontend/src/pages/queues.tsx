import { withUrqlClient } from "next-urql"
import React from "react"
import { Queue } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface QueueProps {}

const Queues: React.FC<QueueProps> = () => {
  return <div>Queues</div>
}

export default withUrqlClient(createUrqlClient)(Queues)
