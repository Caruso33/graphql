import { Heading } from "@chakra-ui/core"
import React from "react"
import Layout from "../components/Layout"
import PageWrapper from "../components/PageWrapper"
import QueueList from "../components/QueueList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Layout>
      <PageWrapper>
        <Heading>Hi</Heading>
        <QueueList />
      </PageWrapper>
    </Layout>
  )
}

export default Index
