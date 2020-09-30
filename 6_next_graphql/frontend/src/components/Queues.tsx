import { Spinner } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import React from "react"
import { Queue, useQueuesQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface QueueProps {}

const Queues: React.FC<QueueProps> = () => {
  const [{ data, fetching }] = useQueuesQuery()

  return (
    <div>
      Current Queues:
      {fetching ? (
        <Spinner />
      ) : (
        data?.queues.map((queue) => <div key={queue.id}>{queue.title}</div>)
      )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(Queues)
