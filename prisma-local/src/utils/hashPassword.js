import bcrypt from "bcrypt"

const hashPassword = password => {
  if (password.length < 8) throw Error("Password does not satisfy requirements")

  return bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS))
}

export default hashPassword
