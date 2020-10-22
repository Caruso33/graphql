import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useContext } from "react"
import { StoreContext } from "state/app"
import Layout from "../../components/Layout"
import { useQueueQuery } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import { getLocalStringFromUnix } from "../../utils/date"

interface QueueProps {}

const Queues: React.FC<QueueProps> = () => {
  const router = useRouter()
  const { id } = router.query

  const [{ data, fetching }] = useQueueQuery({
    variables: { id: parseInt(id as string) },
  })

  const { state: user } = useContext(StoreContext)

  const navigateBack = () => router.back()

  const queue = data?.queue

  const createAtString = queue?.createdAt
    ? getLocalStringFromUnix(parseInt(queue.createdAt))
    : "-"
  const updatedAtString = queue?.updatedAt
    ? getLocalStringFromUnix(parseInt(queue.updatedAt))
    : "-"

  const slips = queue?.slips
console.log('user', user)
  return (
    <Layout>
      <Box>
        <Button onClick={navigateBack} variantColor="teal">
          Go Back
        </Button>
      </Box>

      <Flex align="center" direction="column" mt={5}>
        {fetching ? (
          <Spinner />
        ) : (
          <>
            <div>title: {queue?.title}</div>
            <div>description snippet: {queue?.descriptionSnippet}</div>
            <div>createdAt: {createAtString}</div>
            <div>updatedAt: {updatedAtString}</div>
          </>
        )}

        {user.isSuperAdmin && (
          <Box mt={4}>
            {slips?.length === 0 && <Text>No slips subscribed</Text>}

            {slips?.map?.((slip) => (
              <Text mb={2}>
                {slip.id} - {slip.processed ? "Processed" : "To process"}
              </Text>
            ))}
          </Box>
        )}
      </Flex>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Queues)
