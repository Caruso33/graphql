import { Button, Flex } from "@chakra-ui/core"
import { useRouter } from "next/router"
import React from "react"
import Layout from "../components/Layout"
import PageWrapper from "../components/PageWrapper"
import QueueList from "../components/QueueList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const router = useRouter()
  const navigateToCreateQueue = () => router.push("/create-queue")

  return (
    <Layout>
      <PageWrapper>
        <Flex>
          <Button
            ml="auto"
            mt={4}
            variantColor="teal"
            onClick={navigateToCreateQueue}
          >
            Create new Queue
          </Button>
        </Flex>
        Hi
        <QueueList />
      </PageWrapper>
    </Layout>
  )
}

export default Index
