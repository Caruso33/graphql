import { Flex, Spinner, Heading, Box, Button } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { getLocalStringFromUnix } from "../../utils/date"
import Layout from "../../components/Layout"
import { useQueueQuery } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"

interface QueueProps {}

const Queues: React.FC<QueueProps> = (props) => {
  const router = useRouter()
  const { id } = router.query

  const [{ data, fetching }] = useQueueQuery({
    variables: { id: parseInt(id) },
  })

  const navigateBack = () => router.back()

  const queue = data?.queue ?? {}

  const createAtString = queue?.createdAt
    ? getLocalStringFromUnix(parseInt(queue.createdAt))
    : "-"
  const updatedAtString = queue?.updatedAt
    ? getLocalStringFromUnix(parseInt(queue.updatedAt))
    : "-"

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
      </Flex>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Queues)
