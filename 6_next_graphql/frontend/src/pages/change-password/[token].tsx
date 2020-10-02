import { Box, Button } from "@chakra-ui/core"
import { ErrorMessage, Form, Formik } from "formik"
import { NextPage } from "next"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useState } from "react"
import InputField from "../../components/InputField"
import NavBar from "../../components/NavBar"
import PageWrapper from "../../components/PageWrapper"
import { useChangeForgotPasswordMutation } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import { toErrorMap } from "../../utils/toErrorMap"

interface ChangePasswordProps {
  token: string
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const router = useRouter()
  const [{ data }, changeForgotPassword] = useChangeForgotPasswordMutation()

  return (
    <>
      <NavBar />

      <PageWrapper variant="small">
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
              token,
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

              <Button
                mt={4}
                variantColor="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </PageWrapper>
    </>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  }
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
