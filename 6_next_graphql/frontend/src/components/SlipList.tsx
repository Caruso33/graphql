import { useUnSubscribeFromQueueMutation } from "./../generated/graphql"
import {
  Box,
  Button,
  Text,
  Link,
  Heading,
  Spinner,
  Stack,
  Flex,
} from "@chakra-ui/core"
import NextLink from "next/link"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useSlipsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

interface SlipListProps {}

const SlipList: React.FC<SlipListProps> = () => {
  useIsAuth()

  const router = useRouter()

  const [pagination, setPagination] = useState({ limit: 10, cursor: "" })

  const [{ data, fetching }] = useSlipsQuery({ variables: pagination })
  const [, unsubscribeFromQueue] = useUnSubscribeFromQueueMutation()

  const onLoadMore = () => {
    const slips = data?.slips?.slips
    const lastSlipCursor = slips?.[slips.length - 1]?.createdAt || ""
    setPagination({ ...pagination, cursor: lastSlipCursor })
  }

  const navigateToQueueList = () => router.push("/queues")

  if (!fetching && data?.slips?.slips?.length === 0) {
    return (
      <Flex my={4}>
        <Heading size="lg">No slips present. Subscribe to a Queue?</Heading>

        <Button
          size="sm"
          ml="auto"
          variantColor="teal"
          onClick={navigateToQueueList}
        >
          Subscribe to Queue
        </Button>
      </Flex>
    )
  }

  return (
    <>
      <Box my={4}>
        <Flex>
          <Heading size="lg">Current Slips:</Heading>
          <Button
            size="sm"
            ml="auto"
            variantColor="teal"
            onClick={navigateToQueueList}
          >
            Subscribe to Queue
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
            {data?.slips?.slips?.map((slip) => {
              return (
                <Flex
                  key={slip.id}
                  shadow="md"
                  borderWidth="1px"
                  p={4}
                  background="teal"
                  align="center"
                >
                  <Box w="100%" mr="2rem">
                    <NextLink href={`/slips/${slip.id}`}>
                      <Link>
                        <Heading mb={4} size="md">
                          {slip?.queue?.title || "No Queue"}{" "}
                          {slip?.queue?.descriptionSnippet}
                        </Heading>

                        <Flex justifyContent="space-between">
                          <Box>
                            <Text>Position in Queue: {slip.queuePosition}</Text>
                          </Box>
                          <Box>
                            <Text>{slip.active ? "Active" : "Inactive"}</Text>
                          </Box>
                        </Flex>
                      </Link>
                    </NextLink>
                  </Box>

                  {slip.active && (
                    <Box w="200" ml="auto">
                      <Button
                        size="sm"
                        ml="auto"
                        variantColor="teal"
                        onClick={() => {
                          unsubscribeFromQueue({
                            id: slip?.queue?.id,
                            slipId: slip?.id,
                          })
                        }}
                      >
                        Unsubscribe from Queue
                      </Button>
                    </Box>
                  )}
                </Flex>
              )
            })}
          </Stack>
        )}
      </Box>

      {data && data?.slips?.hasMore && (
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

export default withUrqlClient(createUrqlClient)(SlipList)
