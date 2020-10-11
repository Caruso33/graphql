import { Heading } from "@chakra-ui/core"
import React from "react"
import Layout from "../components/Layout"
import PageWrapper from "../components/PageWrapper"
import QueueList from "../components/QueueList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Layout>
      <Heading>Hi</Heading>
      <QueueList />
    </Layout>
  )
}

export default Index
