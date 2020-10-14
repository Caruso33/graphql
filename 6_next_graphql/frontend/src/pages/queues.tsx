import React from "react"
import Layout from "../components/Layout"
import QueueList from "../components/QueueList"

interface QueuesProps {}

const Queues: React.FC<QueuesProps> = () => {
  return (
    <Layout>
      <QueueList />
    </Layout>
  )
}

export default Queues
