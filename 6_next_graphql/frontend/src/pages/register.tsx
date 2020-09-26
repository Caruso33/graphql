import { Box, Button } from "@chakra-ui/core"
import { dir } from "console"
import { Form, Formik } from "formik"
import React from "react"
import { useMutation } from "urql"
import InputField from "../components/InputField"
import PageWrapper from "../components/PageWrapper"

interface RegisterProps {}

const registerMutation = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
        updatedAt
      }
    }
  }
`

const Register: React.FC<RegisterProps> = () => {
  const [, register] = useMutation(registerMutation)

  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, _actions) => {
          console.dir(values)
          return register(values)
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

export default Register
