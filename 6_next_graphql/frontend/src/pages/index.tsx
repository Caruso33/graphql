import { Box, Flex, Heading } from "@chakra-ui/core"
import React, { useState } from "react"
import Layout from "../components/Layout"
import QueueList from "../components/QueueList"
import SlipList from "../components/SlipList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [slipListKey, setSlipListKey] = useState(Date.now())

  const changeSlipListKey = () => setSlipListKey(Date.now())

  return (
    <Layout>
      <Heading>Hi</Heading>

      <Flex>
        <Box m={2} w="100%">
          <QueueList onSubscribeToQueue={changeSlipListKey} />
        </Box>

        <Box m={2} w="100%">
          <SlipList key={slipListKey} />
        </Box>
      </Flex>
    </Layout>
  )
}

export default Index
