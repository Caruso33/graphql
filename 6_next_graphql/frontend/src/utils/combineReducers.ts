import { actionType } from "state/app"

const combineReducers = (slices: object) => (
  state: object,
  action: actionType
) =>
  Object.keys(slices).reduce(
    // use for..in loop, if you prefer it
    (acc, prop) => ({
      ...acc,
      [prop]: slices[prop](acc[prop], action),
    }),
    state
  )

export default combineReducers
