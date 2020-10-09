import {
  Box,
  Button,
  Text,
  Heading,
  Link,
  Spinner,
  Stack,
  Flex,
} from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useQueuesQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

interface QueueListProps {}

const QueueList: React.FC<QueueListProps> = () => {
  useIsAuth()

  const router = useRouter()

  const navigateToCreateQueue = () => router.push("/create-queue")

  const [pagination, setPagination] = useState({ limit: 10, cursor: "" })

  const [{ data, fetching }] = useQueuesQuery({ variables: pagination })

  const onLoadMore = () => {
    const queues = data?.queues?.queues
    const lastQueueCursor = queues?.[queues.length - 1]?.createdAt || ""
    setPagination({ ...pagination, cursor: lastQueueCursor })
  }

  if (!fetching && !data) {
    return (
      <Box my={4}>
        <Text>No queues present. Create one?</Text>
      </Box>
    )
  }

  return (
    <>
      <Box my={4}>
        <Flex>
          <Heading size="lg">Current Queues:</Heading>
          <Button
            size="sm"
            ml="auto"
            variantColor="teal"
            onClick={navigateToCreateQueue}
          >
            Create new Queue
          </Button>
        </Flex>
      </Box>

      <Box>
        {fetching && !data ? (
          <Flex>
            <Spinner m="auto" />
          </Flex>
        ) : (
          <Stack spacing={10} mt={4}>
            {data?.queues?.queues?.map((queue) => {
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
        )}
      </Box>

      {data && data?.queues?.hasMore && (
        <Button
          my={8}
          onClick={onLoadMore}
          isDisabled={fetching}
          isLoading={fetching}
        >
          <Text>Load More...</Text>
        </Button>
      )}
    </>
  )
}

export default withUrqlClient(createUrqlClient)(QueueList)
