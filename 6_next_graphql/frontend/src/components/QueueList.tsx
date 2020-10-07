import {
  Box,
  Button,
  Text,
  Heading,
  Link,
  Spinner,
  Stack,
} from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React, { useState } from "react"
import { useQueuesQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

interface QueueListProps {}

const QueueList: React.FC<QueueListProps> = () => {
  useIsAuth()

  const [pagination, setPagination] = useState({ limit: 10, cursor: "" })

  const [{ data, fetching }] = useQueuesQuery({ variables: pagination })

  const onLoadMore = () => {
    const lastQueueCursor = data.queues?.[data.queues.length - 1]?.createdAt
    setPagination({ ...pagination, cursor: lastQueueCursor })
  }

  return (
    <>
      <Box my={4}>Current Queues:</Box>

      <Box>
        {fetching ? (
          <Spinner />
        ) : (
          <Stack spacing={10} mt={4}>
            {data?.queues.map((queue) => {
              return (
                <Box key={queue.id} shadow="md" borderWidth="1px" p={4} background='teal'>
                  <NextLink href={`/queues/${queue.id}`}>
                    <Link>
                      <Heading mb={4} fontSize="xl">{queue.title}</Heading>
                      <Text>{queue.description}</Text>
                    </Link>
                  </NextLink>
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      <Button mt={4} onClick={onLoadMore}>Load More...</Button>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(QueueList)
