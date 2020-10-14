import { stringifyVariables } from "@urql/core"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { dedupExchange, fetchExchange } from "urql"
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql"
import { graphqlUrl } from "../utils/constants"
import { betterUpdateQuery } from "./betterUpdateQuery"

export const createUrqlClient = (ssrExchange: any) => ({
  url: graphqlUrl,
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    // cacheExchange({
    //   keys: {
    //     PaginatedQueues: () => null,
    //   },
    //   resolvers: {
    //     Query: {
    //       queues: cursorPagination(),
    //     },
    //   },
    //   updates: {
    //     Mutation: {
    //       logout: (_result, args, cache, info) => {
    //         betterUpdateQuery<LogoutMutation, MeQuery>(
    //           cache,
    //           { query: MeDocument },
    //           _result,
    //           (result, query) => ({ me: null })
    //         )
    //       },
    //       login: (_result, args, cache, info) => {
    //         betterUpdateQuery<LoginMutation, MeQuery>(
    //           cache,
    //           { query: MeDocument },
    //           _result,
    //           (result, query) => {
    //             if (result.login.errors) {
    //               return query
    //             } else {
    //               return { me: result.login.user }
    //             }
    //           }
    //         )
    //       },

    //       register: (_result, args, cache, info) => {
    //         betterUpdateQuery<RegisterMutation, MeQuery>(
    //           cache,
    //           { query: MeDocument },
    //           _result,
    //           (result, query) => {
    //             if (result.register.errors) {
    //               return query
    //             } else {
    //               return { me: result.register.user }
    //             }
    //           }
    //         )
    //       },
    //     },
    //   },
    // }),
    ssrExchange,
    fetchExchange,
  ],
})

export interface PaginationParams {
  offsetArgument?: string
  limitArgument?: string
}

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info

    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)

    if (fieldInfos.length === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}${stringifyVariables(fieldArgs)}`
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey),
      "queues"
    )

    info.partial = !isInCache

    const results: string[] = []
    let hasMore = true

    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
      const data = cache.resolve(key, "queues") as string[]
      const hasMoreKey = cache.resolve(key, "hasMore")

      if (!hasMoreKey) hasMore = false

      results.push(...data)
    })

    return {
      __typename: 'PaginatedQueues',
      hasMore,
      queues: results,
    }
  }
}
