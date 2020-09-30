import { UsernamePasswordInput } from "../types/user"

export const validateEmail = (email: string) => {
  const errors = []

  if (!email.includes("@") && email.length < 7) {
    errors.push({
      field: "email",
      message: "must contain '@' sign and length must be greater than 6",
    })
  }

  return errors.length > 0 ? errors : null
}

export const validateUsername = (username: string) => {
  const errors = []

  if (username.length <= 2) {
    errors.push({ field: "username", message: "length must be greater than 2" })
  }

  if (username.includes("@")) {
    errors.push({ field: "username", message: "cannot include an '@' sign" })
  }

  return errors.length > 0 ? errors : null
}

export const validatePassword = (password: string) => {
  const errors = []

  if (password.length <= 2) {
    errors.push({ field: "password", message: "length must be greater than 2" })
  }

  return errors.length > 0 ? errors : null
}

export const validateRegister = (options: UsernamePasswordInput) => {
  const errors = []

  errors.concat(validateEmail(options.email))

  errors.concat(validateUsername(options.username))

  errors.concat(validatePassword(options.password))

  return errors.length > 0 ? errors : null
}
