import { Box, Heading, Link, Stack, Text } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React from "react"
import { useIsAuth } from "utils/useIsAuth"
import Layout from "../components/Layout"
import { createUrqlClient } from "../utils/createUrqlClient"

interface AdminProps {}

function Admin(): React.FC<AdminProps> {
  const { data } = useIsAuth()

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
