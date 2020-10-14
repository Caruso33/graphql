import { Heading } from "@chakra-ui/core"
import React from "react"
import Layout from "../components/Layout"
import SlipList from "../components/SlipList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Layout>
      <Heading>Hi</Heading>

      <SlipList />
    </Layout>
  )
}

export default Index
