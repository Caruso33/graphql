export function getLocalStringFromUnix(date = "") {
  const dateObj = new Date(date)

  if (!date || !isValidDate(dateObj)) {
    return ""
  }

  return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}
