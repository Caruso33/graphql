import clearAllSettings from "utils/clearAllSettings"
import { actionType } from "./app"

export const userInitialState = {
  id: null,
  username: "",
  adminOfQueues: [],
  isSuperAdmin: false,
}

export default function userReducer(state: object, action: actionType) {
  switch (action.type) {
    case "me":
      return { ...state, ...action.payload }

    case "logout":
      clearAllSettings()
      return { ...state, ...userInitialState }

    default:
      return state
  }
}
