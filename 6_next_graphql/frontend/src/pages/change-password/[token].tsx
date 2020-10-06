import { Box, Button, Flex } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import InputField from "../../components/InputField"
import Layout from "../../components/Layout"
import { useChangeForgotPasswordMutation } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import { toErrorMap } from "../../utils/toErrorMap"

interface ChangePasswordProps {}

const ChangePassword: NextPage<ChangePasswordProps> = () => {
  const router = useRouter()
  const navigateToForgotLogin = () => router.push("/login")

  const [, changeForgotPassword] = useChangeForgotPasswordMutation()
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ newPassword: "", passwordConfirmation: "" }}
        onSubmit={async (values, actions) => {
          if (
            !values.newPassword ||
            values.newPassword !== values.passwordConfirmation
          ) {
            actions.setErrors({ newPassword: "Password don't match." })
            return
          }

          const response = await changeForgotPassword({
            newPassword: values.newPassword,
            token: (router.query?.token as string | undefined) ?? "",
          })
          if (response.data?.changeForgotPassword.errors) {
            const errorMap = toErrorMap(
              response.data.changeForgotPassword.errors
            )

            if ("token" in errorMap) {
              actions.setErrors({
                ...errorMap,
                passwordConfirmation: errorMap.token,
              })
            } else {
              actions.setErrors(errorMap)
            }
          } else if (response.data?.changeForgotPassword.user) {
            router.push("/")
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />

            <Box mt={4}>
              <InputField
                name="passwordConfirmation"
                placeholder="password confirmation"
                label="Password Confirmation"
                type="password"
              />
            </Box>

            <Flex justify="space-between" mt={4}>
              <Button
                variantColor="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Change Password
              </Button>

              <Button onClick={navigateToForgotLogin}>Forgot Password</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
