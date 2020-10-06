import { Box, Button, Flex, useToast } from "@chakra-ui/core"
import { Form, Formik, FormikProps } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import InputField from "../components/InputField"
import Layout from "../components/Layout"
import PageWrapper from "../components/PageWrapper"
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { toErrorMap } from "../utils/toErrorMap"

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter()

  const toast = useToast()

  const [, login] = useLoginMutation()
  const [{ fetching }, forgotPassword] = useForgotPasswordMutation()

  const onForgotPassword = (
    props: FormikProps<{
      usernameOrEmail: string
      password: string
    }>
  ) => {
    const field = props.getFieldProps("usernameOrEmail")

    if (!field.value) {
      props.setFieldError("usernameOrEmail", "email must be provided")

      return
    }

    if (!field.value.includes("@")) {
      props.setFieldError("usernameOrEmail", "must be an email")

      return
    }

    forgotPassword({ email: field.value }).then(({ data }) => {
      if (data?.forgotPassword)
        toast({
          title: "Forgot Password Email Send.",
          description: "Please check your email and follow the link.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      else {
        toast({
          title: "Something went wrong.",
          description: "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    })
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        initialTouched={{ usernameOrEmail: true }}
        onSubmit={async (values, actions) => {
          const response = await login(values)

          if (response.data?.login.errors) {
            actions.setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            router.push((router.query?.next as string | undefined) ?? "/")
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Flex justify="space-between" mt={4}>
              <Button
                variantColor="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Login
              </Button>

              <Button
                onClick={() => onForgotPassword(props)}
                isLoading={fetching}
              >
                Forgot Password?
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
