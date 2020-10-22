// https://stackoverflow.com/questions/59200785/react-usereducer-how-to-combine-multiple-reducers

import React, { createContext, useMemo, useReducer } from "react"
import combineReducers from "utils/combineReducers"
import userReducer, { userInitialState } from "./user"

export const StoreContext = createContext()

export const initialState = { user: userInitialState }

function rootReducer(state: object, action: actionType) {
  switch (action.type) {
    case "reset_state":
      return initialState

    default:
      break
  }

  return appReducer(state, action)
}

const appReducer = combineReducers({ user: userReducer })

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState)

  // Important(!): memoize array value. Else all context consumers update on *every* render
  const store = useMemo(() => ({ state, dispatch }), [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default StoreProvider

export type actionType = {
  type: string
  payload: object | string
}

export type StoreContextType = {
  dispatch: ({ type, payload }: actionType) => Promise<object> | null
  state: object
}
