import { Box, Grid, Link, Spinner } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React from "react"
import { useQueuesQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface QueueListProps {}

const QueueList: React.FC<QueueListProps> = () => {
  const [{ data, fetching }] = useQueuesQuery()

  return (
    <Grid templateColumns="1fr 20rem 50rem 1fr" gap={6}>
      <Box />

      <Box>Current Queues:</Box>

      <Box>
        {fetching ? (
          <Spinner />
        ) : (
          data?.queues.map((queue) => {
            return (
              <NextLink href={`/queues/${queue.id}`}>
                <Link>
                  <div key={queue.id}>{queue.title}</div>
                </Link>
              </NextLink>
            )
          })
        )}
      </Box>

      <Box />
    </Grid>
  )
}

export default withUrqlClient(createUrqlClient)(QueueList)
