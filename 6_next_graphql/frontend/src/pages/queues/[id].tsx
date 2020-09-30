import { Flex, Spinner } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import NavBar from "../../components/NavBar"
import { useQueueQuery } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"

interface QueueProps {}

const Queues: React.FC<QueueProps> = (props) => {
  const router = useRouter()
  const { id } = router.query

  const [{ data, fetching }] = useQueueQuery({
    variables: { id: parseInt(id) },
  })

  return (
    <>
      <NavBar />

      <Flex align="center" direction="column" mt={5}>
        {fetching ? (
          <Spinner />
        ) : (
          <>
            <div>id: {data?.queue?.id}</div>
            <div>title: {data?.queue?.title}</div>
            <div>createdAt: {data?.queue?.createdAt}</div>
            <div>updatedAt: {data?.queue?.updatedAt}</div>
          </>
        )}
      </Flex>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Queues)
