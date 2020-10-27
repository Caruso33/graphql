import { useContext, useEffect } from "react"
import { useMeQuery } from "../generated/graphql"
import { useRouter } from "next/router"
import { usePrevious } from "@chakra-ui/core"
import { StoreContext, StoreContextType } from "state/app"
import { isServer } from "./isServer"

export const useIsAuth = (args = { pause: isServer() }) => {
  const router = useRouter()

  const {
    dispatch,
    // state: { user },
  }: StoreContextType = useContext(StoreContext)

  // TODO: This should not fetch on rerender if data is already there
  const [{ data, fetching }] = useMeQuery(args)

  const prevMe = usePrevious(data)
  useEffect(() => {
    if (!fetching && !data?.me && !router.pathname.startsWith("/login")) {
      router.replace("/login?next=" + router.pathname)
    }

    if (!prevMe && data?.me) {
      dispatch({ type: "me", payload: data.me })
    }
  }, [fetching, data, router])

  return { data, fetching }
}
