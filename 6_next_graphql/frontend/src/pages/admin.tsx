import { Box, Heading, Link, Text, List, Stack } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import React from "react"
import { useMeQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { isServer } from "../utils/isServer"
import NextLink from "next/link"
import Layout from "../components/Layout"

interface AdminProps {}

function Admin(): React.FC<AdminProps> {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })

  return (
    <Layout>
      <Heading size="lg">Admin of Queues:</Heading>
      <Stack spacing={10} mt={4}>
        {data?.me?.adminOfQueues?.map((queue) => {
          return (
            <Box
              key={queue.id}
              shadow="md"
              borderWidth="1px"
              p={4}
              background="teal"
            >
              <NextLink href={`/queues/${queue.id}`}>
                <Link>
                  <Heading mb={4} size="md">
                    {queue.title}
                  </Heading>
                  <Text>{queue.descriptionSnippet}..</Text>
                </Link>
              </NextLink>
            </Box>
          )
        })}
      </Stack>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Admin)
