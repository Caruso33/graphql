import styled from "styled-components"
import React from "react"
import NavBar from "../components/NavBar"
import NextLink from "next/link"
import { Link } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface IndexProps {}

const BlockLink = styled(Link)`
  display: block;
`

const Index: React.FC<IndexProps> = () => (
  <div>
    <NavBar />
    Hi
    <NextLink href="/queues">
      <BlockLink>See queues</BlockLink>
    </NextLink>
  </div>
)

export default withUrqlClient(createUrqlClient)(Index)
