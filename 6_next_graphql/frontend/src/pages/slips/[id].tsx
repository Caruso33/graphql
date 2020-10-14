import { Flex, Spinner, Box, Button } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { getLocalStringFromUnix } from "../../utils/date"
import Layout from "../../components/Layout"
import { useQueueQuery, useSlipQuery } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"

interface SlipProps {}

const Queues: React.FC<SlipProps> = (props) => {
  const router = useRouter()
  const { id } = router.query

  const [{ data, fetching }] = useSlipQuery({
    variables: { id: parseInt(id) },
  })

  const navigateBack = () => router.back()

  const slip = data?.slip ?? {}

  const createAtString = slip?.createdAt
    ? getLocalStringFromUnix(parseInt(slip.createdAt))
    : "-"
  const updatedAtString = slip?.updatedAt
    ? getLocalStringFromUnix(parseInt(slip.updatedAt))
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
            <div>Position in Queue: {slip?.queuePosition}</div>
            <div>createdAt: {createAtString}</div>
            <div>updatedAt: {updatedAtString}</div>
          </>
        )}
      </Flex>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Queues)
