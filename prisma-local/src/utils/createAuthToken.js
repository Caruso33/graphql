import jwt from "jsonwebtoken"

const createAuthToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7 days"
  })
}

export default createAuthToken
