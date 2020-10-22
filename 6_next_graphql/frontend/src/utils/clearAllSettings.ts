import { eraseCookie } from "./cookie"

export const eraseAllCookies = () => {
  const cookiesToDelete = ["qid"]

  for (const cookie of cookiesToDelete) {
    eraseCookie(cookie)
  }
}

export default function clearAllSettings() {
  eraseAllCookies()
  localStorage.clear()
}
