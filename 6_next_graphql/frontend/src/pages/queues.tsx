import { Box } from "@chakra-ui/core"
import React from "react"
import QueueList from "../components/QueueList"

interface QueuesProps {}

const Queues: React.FC<QueuesProps> = () => {
  return (
    <Box>
      <QueueList />
    </Box>
  )
}

export default Queues
