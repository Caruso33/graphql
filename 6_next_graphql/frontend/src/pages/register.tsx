import { Box, Button } from "@chakra-ui/core"
import { dir } from "console"
import { Form, Formik } from "formik"
import React from "react"
import { useRouter } from "next/router"
import InputField from "../components/InputField"
import PageWrapper from "../components/PageWrapper"
import { useRegisterMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter()

  const [, register] = useRegisterMutation()

  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await register(values)

          if (response.data?.register.errors) {
            actions.setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            router.push("/")
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />

            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Button
              mt={4}
              variantColor="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </PageWrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
