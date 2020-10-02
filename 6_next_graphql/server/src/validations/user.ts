import { FieldError, UsernamePasswordInput } from "../types/user"

export const validateEmail = (email: string) => {
  const errors: FieldError[] = []

  if (!email.includes("@") && email.length < 7) {
    errors.push({
      field: "email",
      message: "must contain '@' sign and length must be greater than 6",
    })
  }

  return errors
}

export const validateUsername = (username: string) => {
  const errors: FieldError[] = []

  if (username.length <= 2) {
    errors.push({ field: "username", message: "length must be greater than 2" })
  }

  if (username.includes("@")) {
    errors.push({ field: "username", message: "cannot include an '@' sign" })
  }

  return errors
}

export const validatePassword = (password: string, field?: string) => {
  const errors: FieldError[] = []

  if (password.length <= 2) {
    errors.push({
      field: field ? field : "password",
      message: "length must be greater than 2",
    })
  }

  return errors
}

export const validateRegister = (options: UsernamePasswordInput) => {
  const errors: FieldError[] = []

  const arr = validateEmail(options.email)
  errors.push(...arr)

  errors.push(...validateUsername(options.username))

  errors.push(...validatePassword(options.password))

  return errors
}

export const validateChangeForgotPassword = (newPassword: string) => {
  const errors: FieldError[] = []

  errors.push(...validatePassword(newPassword, "newPassword"))

  return errors
}

export enum UserValidationError {
  "usernameOrEmail__notExist",
  "token__expired",
  "token__userNoLongerExist",
}

export const getValidationErrors = (errorTypes: [UserValidationError]) => {
  const errors: FieldError[] = []

  for (const errorType of errorTypes) {
    switch (errorType) {
      case UserValidationError.usernameOrEmail__notExist:
        errors.push({
          field: "usernameOrEmail",
          message: "that username or email doesn't exist",
        })
        break
      case UserValidationError.token__expired:
        errors.push({
          field: "token",
          message: "token expired",
        })
        break
      case UserValidationError.token__userNoLongerExist:
        errors.push({
          field: "token",
          message: "user no longer exists",
        })
        break

      default:
        break
    }
  }

  return errors
}
