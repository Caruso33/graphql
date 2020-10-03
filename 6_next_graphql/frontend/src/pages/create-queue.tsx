import { Box, Button, useToast } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import InputField from "../components/InputField"
import Layout from "../components/Layout"
import { useCreateQueueMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface CreateQueueProps {}

const CreateQueue: React.FC<CreateQueueProps> = () => {
  const router = useRouter()

  const [, createQueue] = useCreateQueueMutation()

  const toast = useToast()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values, _actions) => {
          const response = await createQueue({ options: values })
          if (response.data?.createQueue.errors) {
            toast({
              title: "Something went wrong.",
              description: "Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          } else if (response.data?.createQueue.user) {
            toast({
              title: "Queue created",
              description: "",
              status: "success",
              duration: 5000,
              isClosable: true,
            })
            router.push("/")
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                name="description"
                placeholder="description"
                label="Description"
                textarea
              />
            </Box>

            <Button
              variantColor="teal"
              isLoading={props.isSubmitting}
              type="submit"
              mt={4}
            >
              Create Queue
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreateQueue)
