import { Box, Button, Flex, Link } from "@chakra-ui/core"
import { useRouter } from "next/router"
import React from "react"
import NavBar from "../components/NavBar"
import PageWrapper from "../components/PageWrapper"
import QueueList from "../components/QueueList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const router = useRouter()
  const navigateToCreateQueue = () => router.push("/create-queue")

  return (
    <>
      <NavBar />

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
    </>
  )
}

export default Index
