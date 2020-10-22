import { actionType } from "./app"

export const queueInitialState = {
  queues: [],
}

export default function queueReducer(state: object, action: actionType) {
  switch (action.type) {
    case "queues":
      return { ...state, ...action.payload }

    default:
      return state
  }
}
