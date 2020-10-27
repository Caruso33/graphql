import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  theme,
} from "@chakra-ui/core"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useContext } from "react"
import { StoreContext } from "state/app"
import { useIsAuth } from "utils/useIsAuth"
import { useLogoutMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter()
  const { fetching } = useIsAuth()

  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation()

  const onLogout = () => {
    dispatch({ type: "logout" })
    logout()
    router.push("/login?next=/")
  }

  const {
    state: { user },
    dispatch,
  } = useContext(StoreContext)

  let body = null

  if (fetching && !user?.id) {
    body = <Spinner />
  } else if (!user?.id) {
    body = <NotLoggedIn />
  } else {
    body = (
      <LoggedIn
        {...{
          fetchingLogout,
          onLogout,
          user,
        }}
      />
    )
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg={theme.colors.blackAlpha}
      align="center"
    >
      <Box ml={4}>
        <NextLink href="/">
          <Link>
            <Heading size="lg">Queue App</Heading>
          </Link>
        </NextLink>
      </Box>

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

function LoggedIn({ fetchingLogout, onLogout, user }) {
  return (
    <Flex>
      <Button
        isLoading={fetchingLogout}
        variant="link"
        mr={2}
        onClick={onLogout}
      >
        logout
      </Button>

      <NextLink href={user.adminOfQueues.length > 0 ? "/admin" : ""}>
        <Link mr={2}>
          <Box>admin</Box>
        </Link>
      </NextLink>

      <Box>{user.username}</Box>
    </Flex>
  )
}
