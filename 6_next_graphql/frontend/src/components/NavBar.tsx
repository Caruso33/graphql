import { Box, Button, Flex, Link, Spinner, theme } from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React from "react"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { isServer } from "../utils/isServer"

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation()

  let body = null

  if (fetching) {
    body = <Spinner />
  } else if (!data?.me) {
    body = <NotLoggedIn />
  } else {
    body = (
      <IsNotLoggedIn
        {...{
          fetchingLogout,
          logout,
          data,
        }}
      />
    )
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg={theme.colors.blackAlpha}>
      <Box p={4} ml="auto">
        {body}
      </Box>
    </Flex>
  )
}

export default withUrqlClient(createUrqlClient)(NavBar)

function NotLoggedIn() {
  return (
    <>
      <NextLink href="/login">
        <Link mr={2}>login</Link>
      </NextLink>

      <NextLink href="/register">
        <Link>register</Link>
      </NextLink>
    </>
  )
}

function IsNotLoggedIn({ fetchingLogout, logout, data }) {
  return (
    <Flex>
      <Button
        isLoading={fetchingLogout}
        variant="link"
        mr={2}
        onClick={() => logout()}
      >
        logout
      </Button>

      <NextLink href={data.me.adminOfQueues.length > 0 ? "/admin" : ""}>
        <Link mr={2}>
          <Box>admin</Box>
        </Link>
      </NextLink>

      <Box>{data.me.username}</Box>
    </Flex>
  )
}
