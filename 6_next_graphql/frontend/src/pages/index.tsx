import { Link } from "@chakra-ui/core"
import React from "react"
import styled from "styled-components"
import NavBar from "../components/NavBar"
import Queues from "../components/Queues"

interface IndexProps {}

const BlockLink = styled(Link)`
  display: block;
`

const Index: React.FC<IndexProps> = () => {
  return (
    <div>
      <NavBar />
      Hi
      {/* <NextLink href="/queues">
        <BlockLink>See queues</BlockLink>
      </NextLink> */}
      <Queues />
    </div>
  )
}

export default Index
