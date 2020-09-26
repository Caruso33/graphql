import { Box, Button } from "@chakra-ui/core"
import { Form, Formik } from "formik"
import React from "react"
import InputField from "../components/InputField"
import PageWrapper from "../components/PageWrapper"

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ name: "Sasuke" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
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
