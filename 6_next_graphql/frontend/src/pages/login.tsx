import { Box, Button } from "@chakra-ui/core"
import { dir } from "console"
import { Form, Formik } from "formik"
import React from "react"
import { useRouter } from "next/router"
import InputField from "../components/InputField"
import PageWrapper from "../components/PageWrapper"
import { useLoginMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter()

  const [, login] = useLoginMutation()

  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await login({ options: values })

          if (response.data?.login.errors) {
            actions.setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </PageWrapper>
  )
}

export default Login
