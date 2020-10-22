import { useContext, useEffect } from "react"
import { useMeQuery } from "../generated/graphql"
import { useRouter } from "next/router"
import { usePrevious } from "@chakra-ui/core"
import { StoreContext, StoreContextType } from "state/app"
import { isServer } from "./isServer"

export const useIsAuth = (args = { pause: isServer() }) => {
  const router = useRouter()

  const [{ data, fetching }] = useMeQuery(args)

  const { dispatch }: StoreContextType = useContext(StoreContext)

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
