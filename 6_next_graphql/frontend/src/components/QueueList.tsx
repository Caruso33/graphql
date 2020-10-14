import {
  Box,
  Button,
  Text,
  Heading,
  Link,
  Spinner,
  Stack,
  Flex,
  useToast,
} from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import {
  useQueuesQuery,
  useSubscribeToQueueMutation,
} from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

interface QueueListProps {}

const QueueList: React.FC<QueueListProps> = () => {
  useIsAuth()

  const router = useRouter()
  const toast = useToast()

  const navigateTo = (url) => router.push(url)

  const [pagination, setPagination] = useState({ limit: 10, cursor: "" })

  const [{ data, fetching }] = useQueuesQuery({ variables: pagination })
  const [, subscribeToQueue] = useSubscribeToQueueMutation()

  const onLoadMore = () => {
    const queues = data?.queues?.queues
    const lastQueueCursor = queues?.[queues.length - 1]?.createdAt || ""
    setPagination({ ...pagination, cursor: lastQueueCursor })
  }

  if (!fetching && !data?.queues?.queues?.length === 0) {
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

          <Box ml="auto">
            <Button
              size="sm"
              variantColor="teal"
              onClick={() => navigateTo("/create-queue")}
            >
              Create new Queue
            </Button>

            <Button
              ml={4}
              size="sm"
              variantColor="teal"
              onClick={() => navigateTo("/")}
            >
              See Slips
            </Button>
          </Box>
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
                <Flex
                  key={queue.id}
                  shadow="md"
                  borderWidth="1px"
                  p={4}
                  background="teal"
                  align="center"
                >
                  <Box>
                    <NextLink href={`/queues/${queue.id}`}>
                      <Link>
                        <Heading mb={4} size="md">
                          {queue.title}
                        </Heading>
                        <Text>
                          {queue.descriptionSnippet}
                          {queue.descriptionSnippet?.length >= 50 ? ".." : ""}
                        </Text>
                      </Link>
                    </NextLink>
                  </Box>

                  <Button
                    size="sm"
                    ml="auto"
                    variantColor="teal"
                    onClick={() => {
                      subscribeToQueue({ id: queue.id }).then(({ data }) => {
                        if (!data) {
                          toast({
                            title: "Already subscribed!",
                            description:
                              "Please check your slips. You already subscribed.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          })
                        }
                      })
                    }}
                  >
                    Subscribe to Queue
                  </Button>
                </Flex>
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
